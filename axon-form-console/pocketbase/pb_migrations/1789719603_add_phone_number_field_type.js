/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3598433047")
  const field = collection.fields.getById("select2668773011")

  field.values = [...field.values, "phone_number"]

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3598433047")
  const field = collection.fields.getById("select2668773011")

  field.values = field.values.filter((value) => value !== "phone_number")

  return app.save(collection)
})
