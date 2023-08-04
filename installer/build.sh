tsc
babel ./dist -d babeldist
cp package.json ./babeldist
cd babeldist
pkg . --out-path ../bindist