#
# Packaging driver for RingoJS
#

# -- config --

PROJECT_NAME    = ringojs

# -- internal vars --

PKG_VERSION     = $(shell git describe | cut -b2-4)
DEV_VERSION     = $(shell git describe | cut -b8-)
ifdef DEV_VERSION
    PKG_VERSION := $(PKG_VERSION).dev$(DEV_VERSION)
endif

PKG_DIR         := pkg
PKG_NAME        := $(PROJECT_NAME)-$(PKG_VERSION)

# -- targets --

all: tgz zip deb clean

build:
	ant -q -f ../build.xml jar apidocs test

$(PKG_NAME): build filelist
	mkdir -p $@
	rsync -a --filter '. filelist' .. $@

$(PKG_DIR):
	mkdir -p $(PKG_DIR)

tgz: $(PKG_NAME) $(PKG_DIR)
	tar cfz $(PKG_DIR)/$(PKG_NAME).tar.gz $<

zip: $(PKG_NAME) $(PKG_DIR)
	rm -f $(PKG_DIR)/$(PKG_NAME)
	zip -q -r $(PKG_DIR)/$(PKG_NAME).zip $<

deb: $(PKG_DIR) build
	dpkg-buildpackage -rfakeroot -Tbinary
	dh_clean debian/stamp-ant-build

clean:
	rm -rf $(PKG_NAME)

.PHONY: all build $(PKG_NAME) tgz zip deb clean
