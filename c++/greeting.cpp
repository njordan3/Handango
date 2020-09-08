#include <iostream>
#include <string>
#include "greeting.h"

char* helloUser( char* name ) {
    char result[64];
    strcpy(result, "Hello ");
    strcat(result, name);
    return result;
}