TARGET = build/wireguard_program

BUILD_DIR = build
OBJ_DIR = $(BUILD_DIR)/obj

CXX = g++

CXXFLAGS = -Wall -std=c++23 -I./inc/ -I./lib/cpp-httplib -I./lib/json/include

SRCS = $(wildcard ./src/*.cpp)

OBJS = $(SRCS:./src/%.cpp=$(OBJ_DIR)/%.o)

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $(TARGET)

$(OBJ_DIR)/%.o: ./src/%.cpp | $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

clean:
	rm -rf $(BUILD_DIR)

rebuild: clean all
