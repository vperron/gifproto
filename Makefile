PACKAGE = gifproto

SERVE_PORT = 4000
RELOAD_PORT = 35800

ASSETS_DIRS = app/assets/* node_modules/font-awesome/fonts

BLEASEJS_PATH = node_modules/blease-js
include $(BLEASEJS_PATH)/src/js.mk
