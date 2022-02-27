class CommandController < ApplicationController
  def index
    # read the commands for this context from config/commands.json
    commands = JSON.parse(File.read(File.join(Rails.root, 'config/commands.json')))

    context = params[:context] || 'default'

    # we need to add an index to the commands array
    commands[context].each_with_index do |command, index|
      command['id'] = index
    end

    users = JSON.parse(File.read(File.join(Rails.root, 'config/users.json')))
    render json: commands[context] + users
  end

  def show; end

  def search; end
end
