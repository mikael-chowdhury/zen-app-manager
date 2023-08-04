tsc
babel ./dist -d babeldist
cp package.json ./babeldist
cp ./art ./babeldist
cd babeldist
pkg . --out-path ../bindist
cp ../bindist/* ../../zen-repo/bin