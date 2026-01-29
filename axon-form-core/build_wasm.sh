GOOS=js GOARCH=wasm go build -o build/axonlib.wasm wasm_wrapper.go

echo "✅ Build finished!"
echo "📂 Output folder: build/axonlib.wasm"
