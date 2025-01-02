#include "MenuHandler.hpp"

void MenuHandler::etat(const std::string& status, const std::string& name, const std::string& ip, const std::string& country) {
    bool connected = status == "Connecté";
    const int colWidth = 32;
    std::cout << R"(
            ╔══════════════════════════════════════════════════╗
            ║                CONNEXION  STATUS                 ║
            ╠══════════════════════════════════════════════════╣ )" << std::endl;
    std::cout << "            ║  Status        : " << std::left << std::setw(connected ? colWidth + 1 : colWidth + 2) << status << "║" << std::endl;
    if (connected) {
        std::cout << "            ║  Nom           : " << std::left << std::setw(colWidth) << name << "║" << std::endl;
        std::cout << "            ║  Ip + Port     : " << std::left << std::setw(colWidth) << ip << "║" << std::endl;
        std::cout << "            ║  Pays          : " << std::left << std::setw(colWidth) << country << "║" << std::endl;
    }
    std::cout << "            ╚══════════════════════════════════════════════════╝" << std::endl;
}

void MenuHandler::logo() {
    std::system("clear");
    std::cout << R"(
             _______ _________ _        _______  _       _________
            (  ____ \\__   __/( \      (  ____ \( (    /|\__   __/
            | (    \/   ) (   | (      | (    \/|  \  ( |   ) (   
            | (_____    | |   | |      | (__    |   \ | |   | |   
            (_____  )   | |   | |      |  __)   | (\ \) |   | |   
                  ) |   | |   | |      | (      | | \   |   | |   
            /\____) |___) (___| (____/\| (____/\| )  \  |   | |   
            \_______)\_______/(_______/(_______/|/    )_)   )_(   
                                                          
             _______           _______                  _______  _       
   |\     /|(  ___  )|\     /|(  ____ \       |\     /|(  ____ )( (    /|
   | )   ( || (   ) || )   ( || (    \/       | )   ( || (    )||  \  ( |
   | | _ | || (___) || |   | || (__           | |   | || (____)||   \ | |
   | |( )| ||  ___  |( (   ) )|  __)          ( (   ) )|  _____)| (\ \) |
   | || || || (   ) | \ \_/ / | (              \ \_/ / | (      | | \   |
   | () () || )   ( |  \   /  | (____/\         \   /  | )      | )  \  |
   (_______)|/     \|   \_/   (_______/          \_/   |/       |/    )_)   
    )" << std::endl;
}

void MenuHandler::display() {
    std::cout << R"(            ╔══════════════════════════════════════════════════╗
            ║                      MENU                        ║
            ╠══════════════════════════════════════════════════╣
            ║        1. Choisir un serveur VPN                 ║
            ║        2. Arrêter le VPN                         ║
            ║        0. Quitter                                ║
            ╚══════════════════════════════════════════════════╝ )" << std::endl;
    std::cout << std::endl;
    std::cout << "  >> ";
}

int MenuHandler::getChoice() {
    int choice;
    std::cin >> choice;
    return choice;
}
