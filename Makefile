
build :
	npm run build

clean :
	rm -rf dist

prepare : clean build

publish :
	npm publish

all : prepare publish