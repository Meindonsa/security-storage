
build :
	npm run build
clean :
	npm run clean

prepare : clean build
publish :
	npm publish

all : prepare publish