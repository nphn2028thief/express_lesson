import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { IColor, IColorsOnProducts, IProduct, ISizesOnProducts } from '../types';

export const productRouter = (router: Router) => {
  router.post('/products', verifyToken, verifyAdminToken, (req, res) => {
    const productId = uuidv4();
    const colorId = uuidv4();
    const sizeId = uuidv4();
    const { name, amount, image, modelImage, currentPrice, saleOff, color, symbol, measure } = req.body;

    if (!name || !amount || !image || !modelImage || !currentPrice || !color) {
      return res.status(400).send({
        message: 'Invalid data!',
      });
    }

    db.query<IProduct[]>('SELECT * FROM product WHERE name = ?', [name], (err, products) => {
      if (err) {
        throw err;
      }

      if (products.length) {
        return res.status(400).send({
          message: 'This product already exist',
        });
      }

      const newPrice = (currentPrice * saleOff) / 100;

      db.query(
        'INSERT INTO product (id, name, amount, image, modelImage, currentPrice, saleOff, newPrice, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)',
        [productId, name, amount, image, modelImage, currentPrice, saleOff, newPrice, slugify(name.toLowerCase())],
        (err) => {
          if (err) {
            throw err;
          }

          db.query('INSERT INTO color (id, name) VALUES (?, ?)', [colorId, color], (err) => {
            if (err) {
              throw err;
            }

            db.query('INSERT INTO size (id, symbol, measure) VALUES (?, ?, ?)', [sizeId, symbol, measure], (err) => {
              if (err) {
                throw err;
              }

              db.query(
                'INSERT INTO product_entry (productId, colorId, sizeId) VALUES (?, ?, ?)',
                [productId, colorId, sizeId],
                (err) => {
                  if (err) {
                    throw err;
                  }

                  res.send({
                    message: 'Create product successfully!',
                  });
                },
              );
            });
          });
        },
      );
    });
  });

  // router.get('/products', verifyToken, verifyAdminToken, (req, res) => {
  //   db.query<IProduct[]>(
  //     'SELECT product.id AS productId, product.name AS productName, amount, image, modelImage, currentPrice, saleOff, newPrice, slug, color.id as colorId, color.name AS colorName, size.id as sizeId, size.symbol, size.measure ' +
  //       'FROM express.product ' +
  //       'JOIN express.colorsonproducts ' +
  //       'ON colorsonproducts.productId = product.id ' +
  //       'JOIN express.color ' +
  //       'ON color.id = colorsonproducts.colorId ' +
  //       'JOIN express.sizesonproducts ' +
  //       'ON sizesonproducts.productId = product.id ' +
  //       'JOIN express.size ' +
  //       'ON size.id = sizesonproducts.sizeId',
  //     (err, results) => {
  //       if (err) {
  //         throw err;
  //       }

  //       res.json(results);
  //     },
  //   );
  // });

  // router.get('/products/:id', verifyToken, verifyAdminToken, (req, res) => {});

  // router.patch('/products/:id', verifyToken, verifyAdminToken, (req, res) => {});

  // router.delete('/products/:id', verifyToken, verifyAdminToken, (req, res) => {});
};
