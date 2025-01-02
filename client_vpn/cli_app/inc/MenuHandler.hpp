#pragma once

#include <iostream>
#include <iomanip>

#define RESET   "\033[0m"
#define BOLD    "\033[1m"
#define UNDERLINE "\033[4m"
#define RED     "\033[31m"
#define GREEN   "\033[32m"
#define YELLOW  "\033[33m"
#define BLUE    "\033[34m"
#define CYAN    "\033[36m"
#define MAGENTA "\033[35m"
#define WHITE   "\033[37m"

class MenuHandler {
public:
    void logo();
    void etat(const std::string& status, const std::string& name, const std::string& ip, const std::string& country);
    void display();
    int getChoice();
};
