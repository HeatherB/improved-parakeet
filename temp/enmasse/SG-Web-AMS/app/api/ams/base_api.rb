module AMS
  class BaseAPI < Grape::API
    logger Logger.new(File.join(Rails.root, 'log', 'api_access.log')) unless Rails.env.test?

    def self.inherited(subclass)
      super
      subclass.instance_eval do
        helpers AMS::BaseAPI::LoggingHelper
        helpers AMS::BaseAPI::ResponseHelper

        version 'v1', using: :accept_version_header
        format :json

        rescue_from ActiveRecord::RecordNotFound do |e|
          message = e.message.gsub(/\s*\[.*\Z/, '')
          Rack::Response.new(
            [{ error_code: 'not_found', error_message: message }.to_json],
            404,
            { 'Content-Type' => 'application/json' }
          ).finish
        end

        rescue_from ActiveRecord::RecordNotSaved do |e|
          message = e.message.gsub(/\s*\[.*\Z/, '')
          Rack::Response.new(
            [{ error_code: 'not_saved', error_message: message }.to_json],
            409,
            { 'Content-Type' => 'application/json' }
          ).finish
        end

        rescue_from ActiveRecord::RecordNotUnique do |e|
          message = e.message.downcase.capitalize
          Rack::Response.new(
            [{ error_code: 'record_not_unique', error_message: message }.to_json],
            409,
            { 'Content-Type' => 'application/json' }
          ).finish
        end

        rescue_from ActiveRecord::RecordInvalid do |e|
          message = e.message.downcase.capitalize
          Rack::Response.new(
            [{ error_code: 'record_invalid', error_message: message }.to_json],
            403,
            { 'Content-Type' => 'application/json' }
          ).finish
        end

        rescue_from Grape::Exceptions::ValidationErrors do |e|
          Rack::Response.new(
            [{ error_code: 'argument_error', error_message: e.message }.to_json],
            422,
            { 'Content-Type' => 'application/json' }
          ).finish
        end

        rescue_from :all do |e|
          LoggingHelper.logger.error "error: #{e.message}, backtrace: #{"\n" + LoggingHelper.clean_trace(e.backtrace).join("\n")}"
          Rack::Response.new(
            [{ error_code: 'internal_error', error_message: "#{e.message}", error_class: "#{e.class}", backtrace: LoggingHelper.clean_trace(e.backtrace) }.to_json],
            500,
            { 'Content-Type' => 'application/json' }
          ).finish
        end

        def self.query_filter(attribute_name_type_list)
          params do
            attribute_name_type_list.each do |attribute_name, attribute_type|
              optional attribute_name.to_sym, type: attribute_type, desc: 'Query filter'
            end
            optional :order_by, type: String, desc: 'Field names to be ordered by, add - prefix if you want descending order or + prefix for ascending order, concatenate multiple field names with commna'
          end
        end

        def self.paginate(options = {})
          options.reverse_merge!(
            per_page: 10,
          )
          params do
            optional :page, type: Integer, default: 0, desc: 'Page offset to fetch.'
            optional :per_page, type: Integer, default: options[:per_page], desc: 'Number of results to return per page.'
          end
        end

        def standard_error_codes
          [
            [400, "{'error_code': 'bad_request', 'error_message': 'Unprocessable Authorization header'}"],
            [401, "{'error_code': 'unauthorized', 'error_message': 'Missing authorization header or invalid token'}"],
            [403, "{'error_code': 'record_invalid', 'error_message': '...'}"],
            [404, "{'error_code': 'not_found', 'error_message': '...'}"],
            [409, "{'error_code': 'not_saved', 'error_message': '...'}"],
            [422, "{'error_code': 'argument_error', 'error_message': '...'}"],
            [500, "{'error_code': 'internal_error', 'error_message': '...'}, 'error_class': '...', 'backtrace': '...'"]
          ]
        end

        helpers do
          def paginate(collection)
            page = params[:page]
            per_page = params[:per_page]
            total_count = collection.count
            num_pages = total_count / per_page + 1
            prev_page = page - 1
            next_page = page + 1
            if prev_page < 0
              prev_page = 0
            end
            if next_page >= num_pages
              next_page = num_pages - 1
            end
            header "X-Total",       total_count.to_s
            header "X-Total-Pages", num_pages.to_s
            header "X-Per-Page",    per_page.to_s
            header "X-Page",        page.to_s
            header "X-Next-Page",   next_page.to_s
            header "X-Prev-Page",   prev_page.to_s
            if collection.is_a? Array
              collection.slice(page * per_page, per_page)
            else
              collection.offset(page * per_page).limit(per_page)
            end
          end

          def query_filter(attribute_name_list, collection, joins: [])
            joins.each do |join_collection|
              collection = collection.joins(join_collection.to_sym)
            end
            attribute_name_list.each do |attribute_name|
              if attribute_name.is_a? Hash
                attribute_name.each do |join_collection, join_collection_attribute_name_list|
                  join_collection_attribute_name_list.each do |join_collection_attribute_name|
                    if params[join_collection_attribute_name.to_sym]
                      collection = collection.where(join_collection.to_sym => {join_collection_attribute_name.to_sym => params[join_collection_attribute_name.to_sym]})
                    end
                  end
                end
              elsif params[attribute_name.to_sym]
                collection = collection.where(attribute_name.to_sym => params[attribute_name.to_sym])
              end
            end

            if params[:order_by]
              params[:order_by].split(',').each do |attribute_name|
                if attribute_name.start_with?('-')
                  collection = collection.order("#{attribute_name[1..-1]} desc")
                elsif attribute_name.start_with?('+')
                  collection = collection.order("#{attribute_name[1..-1]}")
                else
                  collection = collection.order("#{attribute_name}")
                end
              end
            end
            collection
          end

          def query_filter_with_paginate(attribute_name_list, collection, joins: [])
            paginate(query_filter(attribute_name_list, collection, joins: joins))
          end

          def new_session_key
            session_key = nil
            10.times do
              session_key = SecureRandom.uuid
              break unless Rails.cache.exist?(session_key)
            end
            session_key.to_s
          end

          def new_session(session_data, expires_in: 10.minutes)
            session_key = new_session_key
            Rails.cache.write(session_key, session_data.to_json, :expires_in => expires_in)
            session_key
          end

          def get_session_data(session_key)
            JSON.load Rails.cache.read(session_key) rescue nil
          end

          def delete_session_data(session_key)
            Rails.cache.delete(session_key)
          end
        end

      end
    end

    module ResponseHelper
      def success!(body={}, entity=nil)
        status 200
        if entity
          present(body, with: entity)
        else
          body
        end
      end
    end

    module LoggingHelper
      def self.logger
        Grape::API.logger
      end

      def logger
        Grape::API.logger
      end

      def clean_trace(trace)
        self.clean_trace(trace)
      end

      def self.clean_trace(trace)
        rails_regex = %r(([\\/:])vendor\1(bundle|rails|plugins)\1)
        trace.select{|t| /#{Regexp.escape(File.expand_path(Rails.root.to_s))}/ =~ t}.reject{|t| rails_regex =~ t}.collect{|t| t.gsub(Rails.root.to_s + '/', '')}
      end
    end

  end
end

