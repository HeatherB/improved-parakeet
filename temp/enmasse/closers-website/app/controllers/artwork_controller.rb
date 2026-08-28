class ArtworkController < ApplicationController
    def submission
        uploadedfile = params['artwork']
        #File.open(Rails.root.join('app', 'assets', 'images', 'uploads', 'upload'), 'wb') do |file|
        #    file.write(uploadedfile.read)
        #end
        puts uploadedfile
        puts "submission received"
    end
end