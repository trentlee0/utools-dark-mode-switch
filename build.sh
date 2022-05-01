targetDir=./dist
rm -r $targetDir/*
tsc
cp -r icon $targetDir/
cp plugin.json $targetDir/
