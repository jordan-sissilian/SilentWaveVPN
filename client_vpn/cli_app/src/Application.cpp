#include "Application.hpp"

void Application::run() {
    try {
        VpnManager vpnManager;
        MenuHandler menuHandler;

        std::cout << "Récupération des informations des serveurs...\n";
        auto serversInfo = vpnManager.getServersInfo();
        if (serversInfo.empty()) {
            throw std::runtime_error("Aucun serveur disponible.");
        }

        bool running = true;
        bool runningVpn = false;

        std::string name;
        std::string ip;
        std::string country;

        auto drawEtat = [&menuHandler](const bool& runningVpn, const std::string& name, const std::string& ip, const std::string& country) {
            if (runningVpn) {
                menuHandler.etat("Connecté", name, ip, country);
            } else {
                menuHandler.etat("Déconnecté", "Aucune", "", "");
            }
        };

        nlohmann::json servConnected;
        while (running) {

            menuHandler.logo();
            if (!servConnected.empty()) {
                drawEtat(runningVpn, servConnected["name"], servConnected["host"], servConnected["localisation"]); // remplace localisation with location
            } else {
                drawEtat(runningVpn, "", "", "");
            }
            menuHandler.display();

            int choice = menuHandler.getChoice();
            switch (choice) {
            case 1: {
                if (runningVpn) {
                    vpnManager.stopVpn();
                    servConnected.clear();
                    runningVpn = false;
                }
                menuHandler.logo();
                drawEtat(runningVpn, "", "", "");

                if ((servConnected = vpnManager.selectServer()).empty()) {
                    break;
                }
                vpnManager.startVpn();
                runningVpn = true;
                break;
            }
            case 2:
                vpnManager.stopVpn();
                std::cout << "VPN arrêté." << std::endl;
                runningVpn = false;

                menuHandler.logo();
                drawEtat(runningVpn, "", "", "");
                ip.clear();
                break;

            case 0:
                running = false;
                if (runningVpn) {
                    runningVpn = false;
                    vpnManager.stopVpn();
                }
                menuHandler.logo();
                drawEtat(runningVpn, "", "", "");
                break;

            default:
                break;
            }
        }
    } catch (const std::exception &e) {
        std::cerr << "Erreur : " << e.what() << std::endl;
    }
}
