// main.cpp
#include <iostream>
#include <string>
#include <stdexcept>

#include "WireGuardConfig.hpp"
#include "VpnClient.hpp"

#define HOST "jordansissilian.fr:8082"
#define GATEWAY (std::string("http://") + HOST)

void displayMenu() {
    std::cout << "\n=== Menu VPN ===\n";
    std::cout << "1. Choisir un serveur VPN\n";
    std::cout << "2. Arrêter le VPN\n";
    std::cout << "0. Quitter\n";
    std::cout << "Votre choix : ";
}

int main() {
    try {
        VpnClient client(GATEWAY);
        WireGuardConfig wgConfig;

        std::cout << "Récupération des informations des serveurs...\n";
        auto serversInfo = client.getServersInfo();
        if (serversInfo.empty()) {
            throw std::runtime_error("Aucun serveur disponible.");
        }

        bool running = true;
        bool runningVpn = false;
        while (running) {
            displayMenu();

            int choice;
            std::cin >> choice;

            switch (choice) {
            case 1: {
                if (runningVpn) {
                    wgConfig.stopWireGuard();
                }
                std::cout << "Serveurs disponibles :\n";
                for (size_t i = 0; i <= serversInfo.size(); i++) {
                    std::string NbServ = std::to_string(i + 1);
                    std::cout << "\t" << i + 1 << ". " << serversInfo["vpn"][NbServ]["name"] << ": " << serversInfo["vpn"][NbServ]["localisation"] << std::endl; //Todo remplace with location
                }
                std::cout << std::endl;
                std::cout << "Entrez le numéro du serveur : ";
                int indexServer;
                while (!(std::cin >> indexServer) || indexServer < 1 || indexServer > serversInfo["vpn"].size()) {
                    std::cout << "Entrée invalide. Veuillez entrer un numéro de serveur valide entre 1 et " 
                            << serversInfo["vpn"].size() << ": ";
                    std::cin.clear();
                    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                }
                indexServer--;

                auto serverInfo = client.getServerInfo(indexServer);
                std::string serverPublicKey = serverInfo["public_key"];
                std::string serverPublicIp = serverInfo["public_ip"];
                auto addUser = client.addUser(indexServer, wgConfig.getPublicKey());

                if (addUser["status"] == "error") {
                    std::string errorMsg = addUser["msg"].get<std::string>();
                    std::cerr << "Erreur: " << errorMsg << std::endl;
                    break;
                } else {
                    std::string clientIPV4 = addUser["ipv4"];
                    std::string clientIPV6 = addUser["ipv6"];

                    WireGuardConfigData configData {
                        wgConfig.getPrivateKey(),
                        wgConfig.getPublicKey(),
                        serverPublicKey,
                        clientIPV4,
                        clientIPV6,
                        serverPublicIp,
                        51820,
                        CONFIG_FILE_VPN
                    };
                    wgConfig.updateConfigFile(configData);
                }

                wgConfig.startWireGuard();
                std::cout << "VPN démarré avec succès." << std::endl;
                runningVpn = true;
                break;
            }
            case 2:
                wgConfig.stopWireGuard();
                std::cout << "VPN arrêté." << std::endl;
                runningVpn = false;
                break;

            case 0:
                running = false;
                break;

            default:
                std::cerr << "Option invalide." << std::endl;
                break;
            }
        }
        if (runningVpn) {
            wgConfig.stopWireGuard();
        }
    } catch (const std::exception &e) {
        std::cerr << "Erreur : " << e.what() << std::endl;
    }
    return 0;
}
