cd client
sudo ./build.sh
cd ../installer
sudo ./build.sh
cd ..

cd installer
sudo ts-node ./src/index.ts

echo "\n\nfinished full build and install\n\n"