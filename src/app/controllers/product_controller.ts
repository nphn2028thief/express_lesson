import { Request, Response } from 'express';
import slugify from 'slugify';
import productSchema from '../models/product';
import colorSchema from '../models/color';
import sizeSchema from '../models/product';

class ProductController {
  create = async (req: Request, res: Response) => {
    const { name, amount, image, modelImage, currentPrice, saleOff, colors, sizes } = req.body;

    if (!name || !amount || !image || !modelImage || !currentPrice || !colors) {
      return res.status(400).send({
        // message: 'Invalid data!',
        mess: 'haha',
      });
    }

    try {
      const existColor = await colorSchema.findOne({ name: colors.name });

      if (existColor) {
        return res.status(400).send({
          message: 'This color already exist!',
        });
      }

      const existSymbol = await colorSchema.findOne({ symbol: sizes.symbol });

      if (existSymbol) {
        return res.status(400).send({
          message: 'This size already exist!',
        });
      }

      const existMeasure = await colorSchema.findOne({ symbol: sizes.measure });

      if (existMeasure) {
        return res.status(400).send({
          message: 'This measure already exist!',
        });
      }

      const existProduct = await productSchema.findOne({ name });

      if (existProduct) {
        return res.status(400).send({
          message: 'This product already exist!',
        });
      }

      const newPrice = saleOff ? (currentPrice * saleOff) / 100 : 0;
      const productData = {
        name,
        amount,
        image,
        modelImage,
        currentPrice,
        newPrice,
        colors,
        sizes,
        slug: slugify(name.toLowerCase()),
      };

      await productSchema.create(productData);
      await colorSchema.create(colors);
      await sizeSchema.create(sizes);

      res.send({
        message: 'Create product successfully!',
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new ProductController();
