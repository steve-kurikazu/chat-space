class Product < ApplicationRecord
  model Product
    mount_uploader :image, ImageUploader
end