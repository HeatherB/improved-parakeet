module AMS
  module Private
    class SecretQuestionsAPI < AMS::Private::BaseAPI

      resources :secret_questions do

        desc 'List secret questions',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
        end
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::SecretQuestion,
              http_codes: [
                          ] + standard_error_codes
            } do
          secret_questions = paginate(SecretQuestion)
          present secret_questions, with: AMS::Private::Entities::SecretQuestion
        end


        route_param :secret_question_id do
          desc 'Get the subscription question',
               {
                 notes: <<-NOTE

                 NOTE
               }
          params do
            requires :secret_question_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::SecretQuestion,
                http_codes: [
                            ] + standard_error_codes
              } do
            secret_question = SecretQuestion.find(params[:secret_question_id])
            present secret_question, with: AMS::Private::Entities::SecretQuestion
          end
        end

      end
    end
  end
end
