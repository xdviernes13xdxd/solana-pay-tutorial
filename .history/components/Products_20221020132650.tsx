<div className="grid grid-cols-2 gap-8">
  {products.map(product => {
    return (
      <div className="rounded-md bg-white text-left p-8" key={product.id}>
        <h3 className="text-2xl font-bold">{product.name}</h3>
        <p className="text-sm text-gray-800">{product.description}</p>
        <p className="my-4">
          {/* We updated the next line */}
          <span className="mt-4 text-xl font-bold">${product.priceUsd}</span>
          {product.unitName && <span className="text-sm text-gray-800"> /{product.unitName}</span>}
        </p>
        <div className="mt-1">
          <NumberInput name={product.id} formRef={formRef} />
        </div>
      </div>
    )
  })}
</div>