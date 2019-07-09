#!/bin/bash

if [[ "${BASH_SOURCE[0]}" == "$0" ]]
then
  exit 1
fi


function private::ThotPatrol_screen_name () {
  screen -ls | grep "\\.${NAME//./\\.}"
}


function method::debug () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    print::error "$NAME is already running!"
    print::info "Stop ThotPatrol before you run it in dubug mode!"
  else
    node -r ./utils/globals.js .
  fi
}

function method::fix-dependencies () {
  print::message "Fixing dependencies..."
  rm -rf node_modules package-lock.json
  yarn install --production --no-lockfile
}

function method::fix-locales () {
  print::message "Fixing locales..."
  export LC_ALL="$LANG"
  grep -qF "LC_ALL=\"$LANG\"" /etc/environment || echo "LC_ALL=\"$LANG\"" | sudo tee -a /etc/environment 1>/dev/null
}

function method::help () {
  echo
  echo -e "${CYAN}ThotPatrol${NC} - One of the best Discord Bot!"
  echo -e "Give awesome perks to your Discord Server!"
  echo
  echo -e "${GREEN}Usage:${NC}"
  echo " $0 --[OPTION]"
  echo
  echo -e "${GREEN}Options:${NC}"
  echo " --debug      Start ThotPatrol in debug mode to see the issue that is"
  echo "              preventing ThotPatrol from booting. Does not start ThotPatrol in"
  echo "              background, so if you close the debug mode, ThotPatrol stops."
  echo " --fix-d      Fixes dependencies issues by reinstalling dependencies."
  echo " --fix-l      Fixes locales issue that causes errors with youtube-dl."
  echo " --reset      Removes all the data stored by ThotPatrol. Useful when you"
  echo "              want to start from scratch or if you have somehow"
  echo "              corrupted the database."
  echo " --restart    Restarts ThotPatrol."
  echo " --show       Shows you real-time log of ThotPatrol running in background."
  echo " --start      Starts ThotPatrol in background - in a screen session -"
  echo "              which will keep running even if you close the terminal."
  echo " --status     Shows you if ThotPatrol is running in the background or not."
  echo " --stop       Stops ThotPatrol's process that is running in the background."
  echo " --update     Updates ThotPatrol to the latest version without losing data."
  echo
  echo -e "${GREEN}Examples:${NC}"
  echo " $0 --start"
  echo " $0 --stop"
  echo " $0 --update"
  echo
}

function method::reset () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    print::error "$NAME is currently running."
    print::info "Stop ThotPatrol before resetting the saved data."
  else
    print::message "Resetting ThotPatrol..."

    if [ -r ./data/ThotPatrol.db ]; then
      modifiedDate="$(date -r data/ThotPatrol.db -u +%y%m%d%H%M)"
      print::message "Backing up database to backup_${modifiedDate}.db..."
      mv ./data/ThotPatrol.db "./data/backup_${modifiedDate}.db"
    fi

    print::message "Removing saved data..."
    rm -fr ./data/ThotPatrol.db ./package-lock.json ./screenlog.0
    print::message "Done."
    echo

    print::message "All the saved data was removed from ThotPatrol."
  fi
}

function method::show () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    tail -f screenlog.0
  else
    print::info "$NAME is currently ${RED}stopped${NC}!"
  fi
}

function method::start () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    print::info "$NAME is already started."
  else
    print::message "Checking ThotPatrol System..."
    if [ -r index.js ]
    then
      print::message "System check successful."
      echo

      print::message "Booting up..."

      screen -L -dmS "$NAME" /bin/bash -c "until node -r ./utils/globals.js .; do sleep 1; done"

      print::info "$NAME was successfully started!"
    else
      print::error "System check failed."
      echo

      print::message "Check if you have installed ThotPatrol correctly."
      print::message "Follow the installation guide: https://docs.ThotPatrolbot.org"
    fi
  fi
}

function method::status () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    print::info "$NAME is currently ${GREEN}running${NC}!"
  else
    print::info "$NAME is currently ${RED}stopped${NC}!"
  fi
}

function method::stop () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    kill "$(private::ThotPatrol_screen_name | awk -F . '{print $1}' | awk '{print $1}')"
    print::info "$NAME was successfully ${RED}stopped!"
  else
    print::info "$NAME is currently ${RED}stopped${NC}!"
  fi
}

# shellcheck disable=SC2181
function method::update () {
  if [[ $(private::ThotPatrol_screen_name) ]]
  then
    print::error "$NAME is currently running."
    print::info "Stop ThotPatrol before running the update."
  else
    print::message "Updating..."

    git pull
    if ! [[ "$?" -eq 0 ]]
    then
      print::error "Failed to download files for updating."
      print::message "Contact ThotPatrol Support for help."
      return 1
    fi

    echo "Updating dependencies..."

    rm -fr node_modules package-lock.json screenlog.0
    yarn install --production --no-lockfile
    if ! [[ "$?" -eq 0 ]]
    then
      print::error "Failed to install dependencies."
      print::message "Contact ThotPatrol Support for help."
      exit 1
    fi

    print::message "Ready to boot up and start running."
  fi
}
