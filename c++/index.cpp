#define NAPI_VERSION 3
#include <node_api.h>
#include "greeting.h"

napi_value greetHello(napi_env env, napi_callback_info info) {
    napi_status status;
    size_t argc = 1;
    char name[64];
    size_t name_size;
    napi_value argv[1];
    
    status = napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Failed to parse arguments");
    }

    status = napi_get_value_string_utf8(env, argv[0], name, 64, &name_size);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Invalid number was passed as argument");
    }

    char* greeting = helloUser(name);
    napi_value result;
    
    status = napi_create_string_utf8(env, greeting, NAPI_AUTO_LENGTH, &result);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Failed to create Javascript string from greeting");
    }

    return result;
}

 napi_value Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, greetHello, NULL, &fn);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "An error occured when creating function 'greetHello'");
    }
    status = napi_set_named_property(env, exports, "greetHello", fn);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "An error occured when named property 'greetHello'");
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);