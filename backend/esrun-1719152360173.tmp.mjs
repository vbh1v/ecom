process.argv = [process.argv[0], ...process.argv.slice(3)];

		import __esrun_url from 'url';

		import { createRequire as __esrun_createRequire } from "module";

		const __esrun_fileUrl = __esrun_url.pathToFileURL("esrun-1719152360173.tmp.mjs");

		const require = __esrun_createRequire(__esrun_fileUrl);
// server.ts
import express from "../node_modules/express/index.js";
import dotenv2 from "../node_modules/dotenv/lib/main.js";

// secrets.ts
import dotenv from "../node_modules/dotenv/lib/main.js";
dotenv.config({ path: ".env" });
var PORT = process.env.PORT;
var JWT_SECRET = process.env.JWT_SECRET;

// ../routes/index.ts
import { Router as Router6 } from "../node_modules/express/index.js";

// controllers/auth.ts
import { hashSync, compareSync } from "../node_modules/bcrypt/bcrypt.js";
import jsonwebtoken from "../node_modules/jsonwebtoken/index.js";

// exceptions/root.ts
var HttpException = class extends Error {
  constructor(message, errorCode, statusCode, error) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
};

// exceptions/bad-requests.ts
var BadRequestsException = class extends HttpException {
  constructor(message, errorCode, errors) {
    super(message, errorCode, 400, errors);
  }
};

// schema/users.ts
import { z } from "../node_modules/zod/lib/index.mjs";
var SignupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
});
var AddressSchema = z.object(
  {
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    country: z.string(),
    pincode: z.string().length(6),
    city: z.string()
  }
);
var UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional()
});

// exceptions/not-found.ts
var NotFoundException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 404, null);
  }
};

// controllers/auth.ts
var signup = async (req, res, next) => {
  SignupSchema.parse(req.body);
  const { email, password, name } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    new BadRequestsException("User already exists!", 1002 /* USER_ALREADY_EXISTS */);
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10)
    }
  });
  res.json(user);
};
var login = async (req, res) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException("User not found.", 1001 /* USER_NOT_FOUND */);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException("Incorrect password", 1003 /* INCORRECT_PASSWORD */);
  }
  const token = jsonwebtoken.sign({
    userId: user.id
  }, JWT_SECRET);
  res.json({ user, token });
};
var me = async (req, res) => {
  res.json(req.user);
};

// exceptions/internal-exception.ts
var InternalException = class extends HttpException {
  constructor(message, errors, errorCode) {
    super(message, errorCode, 500, errors);
  }
};

// error-handler.ts
import { ZodError } from "../node_modules/zod/lib/index.mjs";
var errorHandler = (method) => {
  return async (req, res, next) => {
    try {
      await method(req, res, next);
    } catch (error) {
      let exception;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestsException("Unprocessable entity.", 2001 /* UNPROCESSABLE_ENTITY */, error);
        } else {
          exception = new InternalException("Something went wrong!", error, 3001 /* INTERNAL_EXCEPTION */);
        }
      }
      next(exception);
    }
  };
};

// middlewares/auth.ts
import jsonwebtoken2 from "../node_modules/jsonwebtoken/index.js";

// exceptions/unauthorised-exception.ts
var UnauthorisedException = class extends HttpException {
  constructor(message, errorCode, errors) {
    super(message, errorCode, 401, errors);
  }
};

// middlewares/auth.ts
var authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new UnauthorisedException("Unauthorised!", 4001 /* UNAUTHORISED */));
  }
  try {
    const payload = jsonwebtoken2.verify(token, JWT_SECRET);
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId }
    });
    if (!user) {
      return next(new UnauthorisedException("Unauthorised!", 4001 /* UNAUTHORISED */));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorisedException("Unauthorised!", 4001 /* UNAUTHORISED */));
  }
};
var auth_default = authMiddleware;

// ../routes/auth.ts
import { Router } from "../node_modules/express/index.js";
var authRoutes = Router();
authRoutes.post("/signup", errorHandler(signup));
authRoutes.post("/login", errorHandler(login));
authRoutes.get("/me", [auth_default], errorHandler(me));
var auth_default2 = authRoutes;

// controllers/products.ts
var createProduct = async (req, res) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body
    }
  });
  res.json(product);
};
var updateProduct = async (req, res) => {
  try {
    const product = req.body;
    const updateProduct2 = await prismaClient.product.update({
      where: {
        id: +req.params.id
      },
      data: product
    });
    console.log("Here is the updated product ------->", updateProduct2);
    res.json(updateProduct2);
  } catch (err) {
    throw new NotFoundException(
      "Product not found.",
      5001 /* PRODUCT_NOT_FOUND */
    );
  }
};
var deleteProduct = async (req, res) => {
  try {
    const product = req.body;
    const deleteProduct2 = await prismaClient.product.delete({
      where: {
        id: +req.params.id
      }
    });
    console.log("Here is the deleted product ------->", deleteProduct2);
    res.json(deleteProduct2);
  } catch (err) {
    throw new NotFoundException(
      "Product not found.",
      5001 /* PRODUCT_NOT_FOUND */
    );
  }
};
var listProduct = async (req, res) => {
  const count = prismaClient.product.count();
  const products = await prismaClient.product.findMany({
    skip: +req.query.skip || 0,
    take: 5
  });
  res.json({
    count,
    data: products
  });
};
var getProductById = async (req, res) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id
      }
    });
    console.log("Here is the asked product ------->", product);
    res.json(product);
  } catch (err) {
    throw new NotFoundException(
      "Product not found.",
      5001 /* PRODUCT_NOT_FOUND */
    );
  }
};

// middlewares/admin.ts
var adminMiddleware = async (req, res, next) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorisedException("Unauthorized", 4001 /* UNAUTHORISED */));
  }
};
var admin_default = adminMiddleware;

// ../routes/products.ts
import { Router as Router2 } from "../node_modules/express/index.js";
var productRoutes = Router2();
productRoutes.post("/", [auth_default, admin_default], errorHandler(createProduct));
productRoutes.put("/:id", [auth_default, admin_default], errorHandler(updateProduct));
productRoutes.delete("/:id", [auth_default, admin_default], errorHandler(deleteProduct));
productRoutes.get("/", [auth_default, admin_default], errorHandler(listProduct));
productRoutes.get("/:id", [auth_default, admin_default], errorHandler(getProductById));
var products_default = productRoutes;

// ../routes/users.ts
import { Router as Router3 } from "../node_modules/express/index.js";

// controllers/users.ts
var addAddress = async (req, res) => {
  AddressSchema.parse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id
    }
  });
  res.json(address);
};
var deleteAddress = async (req, res) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: +req.params.id
      }
    });
    res.json({ success: true });
  } catch (err) {
    throw new NotFoundException(
      "Address not found",
      1004 /* ADDRESS_NOT_FOUND */
    );
  }
};
var listAddress = async (req, res) => {
  const addresses = await prismaClient.address.findMany({
    where: {
      userId: req.user.id
    }
  });
  res.json(addresses);
};
var updateUser = async (req, res) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress;
  let billingAddress;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress
        }
      });
    } catch (err) {
      throw new NotFoundException(
        "Address not found",
        1004 /* ADDRESS_NOT_FOUND */
      );
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestsException("Address does not belong to user!", 1005 /* ADDRESS_DOES_NOT_MATCH */);
    }
  }
  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress
        }
      });
    } catch (err) {
      throw new NotFoundException(
        "Address not found",
        1004 /* ADDRESS_NOT_FOUND */
      );
    }
    if (billingAddress.userId != req.user.id) {
      throw new BadRequestsException("Address does not belong to user!", 1005 /* ADDRESS_DOES_NOT_MATCH */);
    }
  }
  const updatedUser = await prismaClient.user.update({
    where: {
      id: req.user.id
    },
    data: validatedData
  });
  res.json(updatedUser);
};

// ../routes/users.ts
var usersRoutes = Router3();
usersRoutes.post("/address", [auth_default], errorHandler(addAddress));
usersRoutes.delete(
  "/address/:id",
  [auth_default],
  errorHandler(deleteAddress)
);
usersRoutes.get("address", [auth_default], errorHandler(listAddress));
usersRoutes.put("/", [auth_default], errorHandler(updateUser));
var users_default = usersRoutes;

// schema/cart.ts
import { z as z2 } from "../node_modules/zod/lib/index.mjs";
var CreateCartSchema = z2.object({
  productId: z2.number(),
  quantity: z2.number()
});
var ChangeQuantitySchema = z2.object({
  quantity: z2.number()
});

// controllers/cart.ts
var addItemToCart = async (req, res) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId
      }
    });
  } catch (err) {
    throw new NotFoundException("Product not found!", 5001 /* PRODUCT_NOT_FOUND */);
  }
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: validatedData.quantity
    }
  });
  res.json(cart);
};
var deleteItemFromCart = async (req, res) => {
  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id
    }
  });
  res.json({ success: true });
};
var changeQuantity = async (req, res) => {
  const validatedData = ChangeQuantitySchema.parse(req.body);
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: +req.params.id
    },
    data: {
      quantity: validatedData.quantity
    }
  });
  res.json(updatedCart);
};
var getCart = async (req, res) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      product: true
    }
  });
  res.json(cart);
};

// ../routes/cart.ts
import { Router as Router4 } from "../node_modules/express/index.js";
var cartRoutes = Router4();
cartRoutes.post("/", [auth_default], errorHandler(addItemToCart));
cartRoutes.get("/", [auth_default], errorHandler(getCart));
cartRoutes.delete("/:id", [auth_default], errorHandler(deleteItemFromCart));
cartRoutes.put("/:id", [auth_default], errorHandler(changeQuantity));
var cart_default = cartRoutes;

// controllers/orders.ts
var createOrder = async (req, res) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        product: true
      }
    });
    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress
      }
    });
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity
            };
          })
        }
      }
    });
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id
      }
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id
      }
    });
    return res.json(order);
  });
};
var listOrder = async (req, res) => {
  const order = await prismaClient.order.findMany({
    where: {
      userId: req.user.id
    }
  });
  res.json(order);
};
var cancelOrder = async (req, res) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: +req.params.id
      },
      data: {
        status: "CANCELLED"
      }
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED"
      }
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found!", 6001 /* ORDER_NOT_FOUND */);
  }
};
var getOrderById = async (req, res) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id
      },
      include: {
        products: true,
        events: true
      }
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException("Order not found!", 6001 /* ORDER_NOT_FOUND */);
  }
};

// ../routes/orders.ts
import { Router as Router5 } from "../node_modules/express/index.js";
var orderRoutes = Router5();
orderRoutes.post("/", [auth_default, admin_default], errorHandler(createOrder));
orderRoutes.put("/:id/cancel", [auth_default, admin_default], errorHandler(cancelOrder));
orderRoutes.get("/", [auth_default, admin_default], errorHandler(listOrder));
orderRoutes.get("/:id", [auth_default, admin_default], errorHandler(getOrderById));
var orders_default = orderRoutes;

// ../routes/index.ts
var rootRouter = Router6();
rootRouter.use("/auth", auth_default2);
rootRouter.use("/products", products_default);
rootRouter.use("/users", users_default);
rootRouter.use("/carts", cart_default);
rootRouter.use("/orders", orders_default);
var routes_default = rootRouter;

// server.ts
import { PrismaClient } from "../node_modules/@prisma/client/default.js";

// middlewares/errors.ts
var errorMiddleware = (error, req, res, next) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors
  });
};

// server.ts
dotenv2.config({ path: ".env" });
var app = express();
console.log(PORT);
app.use(express.json());
app.use("/api", routes_default);
var prismaClient = new PrismaClient({
  log: ["query"]
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`;
        }
      }
    }
  }
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
export {
  prismaClient
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VydmVyLnRzIiwgInNlY3JldHMudHMiLCAiLi4vcm91dGVzL2luZGV4LnRzIiwgImNvbnRyb2xsZXJzL2F1dGgudHMiLCAiZXhjZXB0aW9ucy9yb290LnRzIiwgImV4Y2VwdGlvbnMvYmFkLXJlcXVlc3RzLnRzIiwgInNjaGVtYS91c2Vycy50cyIsICJleGNlcHRpb25zL25vdC1mb3VuZC50cyIsICJleGNlcHRpb25zL2ludGVybmFsLWV4Y2VwdGlvbi50cyIsICJlcnJvci1oYW5kbGVyLnRzIiwgIm1pZGRsZXdhcmVzL2F1dGgudHMiLCAiZXhjZXB0aW9ucy91bmF1dGhvcmlzZWQtZXhjZXB0aW9uLnRzIiwgIi4uL3JvdXRlcy9hdXRoLnRzIiwgImNvbnRyb2xsZXJzL3Byb2R1Y3RzLnRzIiwgIm1pZGRsZXdhcmVzL2FkbWluLnRzIiwgIi4uL3JvdXRlcy9wcm9kdWN0cy50cyIsICIuLi9yb3V0ZXMvdXNlcnMudHMiLCAiY29udHJvbGxlcnMvdXNlcnMudHMiLCAic2NoZW1hL2NhcnQudHMiLCAiY29udHJvbGxlcnMvY2FydC50cyIsICIuLi9yb3V0ZXMvY2FydC50cyIsICJjb250cm9sbGVycy9vcmRlcnMudHMiLCAiLi4vcm91dGVzL29yZGVycy50cyIsICJtaWRkbGV3YXJlcy9lcnJvcnMudHMiXSwKICAic291cmNlUm9vdCI6ICJDOlxcZGV2XFxlY29tXFxiYWNrZW5kIiwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBleHByZXNzLCB7IEV4cHJlc3MsIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XHJcbmltcG9ydCB7IFBPUlQgfSBmcm9tIFwiLi9zZWNyZXRzXCI7XHJcbmltcG9ydCByb290Um91dGVyIGZyb20gXCJAL3JvdXRlc1wiO1xyXG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcclxuaW1wb3J0IHsgZXJyb3JNaWRkbGV3YXJlIH0gZnJvbSBcIi4vbWlkZGxld2FyZXMvZXJyb3JzXCI7XHJcblxyXG5cclxuZG90ZW52LmNvbmZpZyh7IHBhdGg6IFwiLmVudlwiIH0pO1xyXG5cclxuY29uc3QgYXBwOiBFeHByZXNzID0gZXhwcmVzcygpO1xyXG5cclxuY29uc29sZS5sb2coUE9SVCk7XHJcblxyXG5hcHAudXNlKGV4cHJlc3MuanNvbigpKVxyXG5cclxuYXBwLnVzZSgnL2FwaScsIHJvb3RSb3V0ZXIpXHJcblxyXG5leHBvcnQgY29uc3QgcHJpc21hQ2xpZW50ID0gbmV3IFByaXNtYUNsaWVudCh7XHJcbiAgICBsb2c6WydxdWVyeSddXHJcbn0pLiRleHRlbmRzKHtcclxuICByZXN1bHQ6e1xyXG4gICAgYWRkcmVzczp7XHJcbiAgICAgIGZvcm1hdHRlZEFkZHJlc3M6e1xyXG4gICAgICAgIG5lZWRzOiB7XHJcbiAgICAgICAgICBsaW5lT25lOiB0cnVlLFxyXG4gICAgICAgICAgbGluZVR3bzogdHJ1ZSxcclxuICAgICAgICAgIGNpdHk6IHRydWUsXHJcbiAgICAgICAgICBjb3VudHJ5OiB0cnVlLFxyXG4gICAgICAgICAgcGluY29kZTogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29tcHV0ZTogKGFkZHIpID0+IHtcclxuICAgICAgICAgIHJldHVybiAgYCR7YWRkci5saW5lT25lfSwgJHthZGRyLmxpbmVUd299LCAke2FkZHIuY2l0eX0sICR7YWRkci5jb3VudHJ5fS0ke2FkZHIucGluY29kZX1gXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuYXBwLnVzZShlcnJvck1pZGRsZXdhcmUpXHJcblxyXG5hcHAubGlzdGVuKFBPUlQsICgpID0+IHtcclxuICBjb25zb2xlLmxvZyhgW3NlcnZlcl06IFNlcnZlciBpcyBydW5uaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtQT1JUfWApO1xyXG59KTtcclxuIiwgIlxyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcclxuXHJcbmRvdGVudi5jb25maWcoeyBwYXRoOiBcIi5lbnZcIiB9KTtcclxuXHJcbmV4cG9ydCBjb25zdCBQT1JUID0gcHJvY2Vzcy5lbnYuUE9SVFxyXG5leHBvcnQgY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQhIiwgImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCJcclxuaW1wb3J0IGF1dGhSb3V0ZXMgZnJvbSBcIi4vYXV0aFwiXHJcbmltcG9ydCBwcm9kdWN0Um91dGVzIGZyb20gXCIuL3Byb2R1Y3RzXCJcclxuaW1wb3J0IHVzZXJzUm91dGVzIGZyb20gXCIuL3VzZXJzXCJcclxuaW1wb3J0IGNhcnRSb3V0ZXMgZnJvbSBcIi4vY2FydFwiXHJcbmltcG9ydCBvcmRlclJvdXRlcyBmcm9tIFwiLi9vcmRlcnNcIlxyXG5cclxuY29uc3Qgcm9vdFJvdXRlcjogUm91dGVyID0gUm91dGVyKClcclxuXHJcbnJvb3RSb3V0ZXIudXNlKCcvYXV0aCcsIGF1dGhSb3V0ZXMpXHJcbnJvb3RSb3V0ZXIudXNlKCcvcHJvZHVjdHMnLCBwcm9kdWN0Um91dGVzKVxyXG5yb290Um91dGVyLnVzZSgnL3VzZXJzJywgdXNlcnNSb3V0ZXMpXHJcbnJvb3RSb3V0ZXIudXNlKCcvY2FydHMnLCBjYXJ0Um91dGVzKVxyXG5yb290Um91dGVyLnVzZSgnL29yZGVycycsIG9yZGVyUm91dGVzKVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCByb290Um91dGVyXHJcbiIsICJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHsgcHJpc21hQ2xpZW50IH0gZnJvbSBcIi4uL3NlcnZlclwiO1xyXG5pbXBvcnQgeyBoYXNoU3luYywgY29tcGFyZVN5bmMgfSBmcm9tIFwiYmNyeXB0XCI7XHJcbmltcG9ydCBqc29ud2VidG9rZW4gZnJvbSBcImpzb253ZWJ0b2tlblwiO1xyXG5pbXBvcnQgeyBKV1RfU0VDUkVUIH0gZnJvbSBcIi4uL3NlY3JldHNcIjtcclxuaW1wb3J0IHsgQmFkUmVxdWVzdHNFeGNlcHRpb24gfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9iYWQtcmVxdWVzdHNcIjtcclxuaW1wb3J0IHsgRXJyb3JDb2RlIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvcm9vdFwiO1xyXG5pbXBvcnQgeyBTaWdudXBTY2hlbWEgfSBmcm9tIFwiLi4vc2NoZW1hL3VzZXJzXCI7XHJcbmltcG9ydCB7IE5vdEZvdW5kRXhjZXB0aW9uIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvbm90LWZvdW5kXCI7XHJcblxyXG5leHBvcnQgY29uc3Qgc2lnbnVwID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOlJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgIFNpZ251cFNjaGVtYS5wYXJzZShyZXEuYm9keSlcclxuICAgIGNvbnN0IHtlbWFpbCwgcGFzc3dvcmQsIG5hbWV9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgbGV0IHVzZXIgPSBhd2FpdCBwcmlzbWFDbGllbnQudXNlci5maW5kRmlyc3Qoe3doZXJlOiB7ZW1haWx9fSlcclxuICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgbmV3IEJhZFJlcXVlc3RzRXhjZXB0aW9uKCdVc2VyIGFscmVhZHkgZXhpc3RzIScsIEVycm9yQ29kZS5VU0VSX0FMUkVBRFlfRVhJU1RTKVxyXG4gICAgfVxyXG4gICAgdXNlciA9IGF3YWl0IHByaXNtYUNsaWVudC51c2VyLmNyZWF0ZSh7XHJcbiAgICAgICAgZGF0YTp7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIGVtYWlsLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogaGFzaFN5bmMocGFzc3dvcmQsIDEwKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXMuanNvbih1c2VyKVxyXG4gICAgXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBsb2dpbiA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczpSZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc3Qge2VtYWlsLCBwYXNzd29yZH0gPSByZXEuYm9keTtcclxuXHJcbiAgICBsZXQgdXNlciA9IGF3YWl0IHByaXNtYUNsaWVudC51c2VyLmZpbmRGaXJzdCh7d2hlcmU6IHtlbWFpbH19KVxyXG4gICAgaWYgKCF1c2VyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kRXhjZXB0aW9uKCdVc2VyIG5vdCBmb3VuZC4nLCBFcnJvckNvZGUuVVNFUl9OT1RfRk9VTkQpXHJcbiAgICB9XHJcbiAgICBpZighY29tcGFyZVN5bmMocGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RzRXhjZXB0aW9uKCdJbmNvcnJlY3QgcGFzc3dvcmQnLCBFcnJvckNvZGUuSU5DT1JSRUNUX1BBU1NXT1JEKVxyXG4gICAgfVxyXG4gICAgY29uc3QgdG9rZW4gPSBqc29ud2VidG9rZW4uc2lnbih7XHJcbiAgICAgICAgdXNlcklkOiB1c2VyLmlkXHJcbiAgICB9LEpXVF9TRUNSRVQpXHJcblxyXG5cclxuICAgIHJlcy5qc29uKHt1c2VyLCB0b2tlbn0pXHJcbn1cclxuXHJcbi8vIC9tZSAtPiAgcmV0dXJuIHRoZSBsb2dnZWQgaW4gdXNlclxyXG5leHBvcnQgY29uc3QgbWUgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6UmVzcG9uc2UpID0+IHtcclxuXHJcbiAgICByZXMuanNvbihyZXEudXNlcilcclxufSIsICIvLyBNRVNTQUdFLCBTVEFUVVMgQ09ERSwgRVJST1IgQ09ERVMsIEVSUk9SXHJcblxyXG5leHBvcnQgY2xhc3MgSHR0cEV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcclxuICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgIGVycm9yQ29kZTogYW55O1xyXG4gICAgc3RhdHVzQ29kZTogbnVtYmVyO1xyXG4gICAgZXJyb3JzOiBFcnJvckNvZGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBlcnJvckNvZGU6IEVycm9yQ29kZSwgc3RhdHVzQ29kZTpudW1iZXIsIGVycm9yOmFueSkge1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpXHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxyXG4gICAgICAgIHRoaXMuZXJyb3JDb2RlID0gZXJyb3JDb2RlXHJcbiAgICAgICAgdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZVxyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbmV4cG9ydCBlbnVtIEVycm9yQ29kZSB7XHJcbiAgICBVU0VSX05PVF9GT1VORCA9IDEwMDEsXHJcbiAgICBVU0VSX0FMUkVBRFlfRVhJU1RTID0gMTAwMixcclxuICAgIElOQ09SUkVDVF9QQVNTV09SRCA9IDEwMDMsXHJcbiAgICBBRERSRVNTX05PVF9GT1VORCA9IDEwMDQsICAgXHJcbiAgICBBRERSRVNTX0RPRVNfTk9UX01BVENIID0gMTAwNSxcclxuICAgIFVOUFJPQ0VTU0FCTEVfRU5USVRZID0gMjAwMSxcclxuICAgIElOVEVSTkFMX0VYQ0VQVElPTiA9IDMwMDEsXHJcbiAgICBVTkFVVEhPUklTRUQgPSA0MDAxLFxyXG4gICAgUFJPRFVDVF9OT1RfRk9VTkQgPSA1MDAxLFxyXG4gICAgT1JERVJfTk9UX0ZPVU5EID0gNjAwMVxyXG5cclxufSIsICJpbXBvcnQgeyBFcnJvckNvZGUsIEh0dHBFeGNlcHRpb24gfSBmcm9tIFwiLi9yb290XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmFkUmVxdWVzdHNFeGNlcHRpb24gZXh0ZW5kcyBIdHRwRXhjZXB0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgZXJyb3JDb2RlOkVycm9yQ29kZSwgZXJyb3JzPzphbnkpIHtcclxuICAgICAgICBzdXBlcihtZXNzYWdlLCBlcnJvckNvZGUsIDQwMCwgZXJyb3JzKTtcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiXHJcblxyXG5leHBvcnQgY29uc3QgU2lnbnVwU2NoZW1hID0gei5vYmplY3Qoe1xyXG4gICAgbmFtZTogei5zdHJpbmcoKSxcclxuICAgIGVtYWlsOiB6LnN0cmluZygpLmVtYWlsKCksXHJcbiAgICBwYXNzd29yZDogei5zdHJpbmcoKS5taW4oNiksXHJcbn0pXHJcblxyXG5leHBvcnQgY29uc3QgQWRkcmVzc1NjaGVtYSA9IHoub2JqZWN0KHtcclxuICAgIGxpbmVPbmU6IHouc3RyaW5nKCksXHJcbiAgICBsaW5lVHdvOiB6LnN0cmluZygpLm51bGxhYmxlKCksXHJcbiAgICBjb3VudHJ5OiB6LnN0cmluZygpLFxyXG4gICAgcGluY29kZTogei5zdHJpbmcoKS5sZW5ndGgoNiksXHJcbiAgICBjaXR5OiB6LnN0cmluZygpLFxyXG59XHJcbilcclxuXHJcbmV4cG9ydCBjb25zdCBVcGRhdGVVc2VyU2NoZW1hID0gei5vYmplY3Qoe1xyXG4gICAgbmFtZTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxyXG4gICAgZGVmYXVsdFNoaXBwaW5nQWRkcmVzczogei5udW1iZXIoKS5vcHRpb25hbCgpLFxyXG4gICAgZGVmYXVsdEJpbGxpbmdBZGRyZXNzOiB6Lm51bWJlcigpLm9wdGlvbmFsKClcclxufSkiLCAiaW1wb3J0IHsgRXJyb3JDb2RlLCBIdHRwRXhjZXB0aW9uIH0gZnJvbSBcIi4vcm9vdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5vdEZvdW5kRXhjZXB0aW9uIGV4dGVuZHMgSHR0cEV4Y2VwdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGVycm9yQ29kZTpFcnJvckNvZGUpe1xyXG4gICAgICAgIHN1cGVyKG1lc3NhZ2UsIGVycm9yQ29kZSwgNDA0LCBudWxsKVxyXG4gICAgfVxyXG59IiwgImltcG9ydCB7IEh0dHBFeGNlcHRpb24gfSBmcm9tIFwiLi9yb290XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW50ZXJuYWxFeGNlcHRpb24gZXh0ZW5kcyBIdHRwRXhjZXB0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgZXJyb3JzOiBhbnksIGVycm9yQ29kZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSwgZXJyb3JDb2RlLCA1MDAsIGVycm9ycylcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIlxyXG5pbXBvcnQgeyBFcnJvckNvZGUsIEh0dHBFeGNlcHRpb24gfSBmcm9tIFwiLi9leGNlcHRpb25zL3Jvb3RcIlxyXG5pbXBvcnQgeyBJbnRlcm5hbEV4Y2VwdGlvbiB9IGZyb20gXCIuL2V4Y2VwdGlvbnMvaW50ZXJuYWwtZXhjZXB0aW9uXCJcclxuaW1wb3J0IHsgQmFkUmVxdWVzdHNFeGNlcHRpb24gfSBmcm9tIFwiLi9leGNlcHRpb25zL2JhZC1yZXF1ZXN0c1wiXHJcbmltcG9ydCB7IFpvZEVycm9yIH0gZnJvbSBcInpvZFwiXHJcblxyXG5leHBvcnQgY29uc3QgZXJyb3JIYW5kbGVyID0gKG1ldGhvZDogRnVuY3Rpb24pID0+IHtcclxuICAgIHJldHVybiBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBtZXRob2QocmVxLCByZXMsIG5leHQpXHJcbiAgICAgICAgfSBjYXRjaChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICAgIGxldCBleGNlcHRpb246IEh0dHBFeGNlcHRpb247XHJcbiAgICAgICAgICAgIGlmKCBlcnJvciBpbnN0YW5jZW9mIEh0dHBFeGNlcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IGVycm9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYoIGVycm9yIGluc3RhbmNlb2YgWm9kRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBleGNlcHRpb24gPSBuZXcgQmFkUmVxdWVzdHNFeGNlcHRpb24oJ1VucHJvY2Vzc2FibGUgZW50aXR5LicsIEVycm9yQ29kZS5VTlBST0NFU1NBQkxFX0VOVElUWSwgZXJyb3IpXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IG5ldyBJbnRlcm5hbEV4Y2VwdGlvbignU29tZXRoaW5nIHdlbnQgd3JvbmchJywgZXJyb3IsIEVycm9yQ29kZS5JTlRFUk5BTF9FWENFUFRJT04pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV4dChleGNlcHRpb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsICJpbXBvcnQganNvbndlYnRva2VuIGZyb20gXCJqc29ud2VidG9rZW5cIjtcclxuaW1wb3J0IHsgVW5hdXRob3Jpc2VkRXhjZXB0aW9uIH0gZnJvbSBcIi4vLi4vZXhjZXB0aW9ucy91bmF1dGhvcmlzZWQtZXhjZXB0aW9uXCI7XHJcbmltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBFcnJvckNvZGUgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9yb290XCI7XHJcbmltcG9ydCB7IEpXVF9TRUNSRVQgfSBmcm9tIFwiLi4vc2VjcmV0c1wiO1xyXG5pbXBvcnQgeyBwcmlzbWFDbGllbnQgfSBmcm9tIFwiLi4vc2VydmVyXCI7XHJcblxyXG5jb25zdCBhdXRoTWlkZGxld2FyZSA9IGFzeW5jIChcclxuICByZXE6IFJlcXVlc3QsXHJcbiAgcmVzOiBSZXNwb25zZSxcclxuICBuZXh0OiBOZXh0RnVuY3Rpb25cclxuKSA9PiB7XHJcbiAgY29uc3QgdG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xyXG5cclxuICBpZiAoIXRva2VuKSB7XHJcbiAgICByZXR1cm4gbmV4dChuZXcgVW5hdXRob3Jpc2VkRXhjZXB0aW9uKFwiVW5hdXRob3Jpc2VkIVwiLCBFcnJvckNvZGUuVU5BVVRIT1JJU0VEKSk7XHJcbiAgfVxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0ganNvbndlYnRva2VuLnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgYW55O1xyXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYUNsaWVudC51c2VyLmZpbmRGaXJzdCh7XHJcbiAgICAgIHdoZXJlOiB7IGlkOiBwYXlsb2FkLnVzZXJJZCB9LFxyXG4gICAgfSk7XHJcbiAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgcmV0dXJuIG5leHQobmV3IFVuYXV0aG9yaXNlZEV4Y2VwdGlvbihcIlVuYXV0aG9yaXNlZCFcIiwgRXJyb3JDb2RlLlVOQVVUSE9SSVNFRCkpO1xyXG4gICAgfVxyXG4gICAgcmVxLnVzZXIgPSB1c2VyO1xyXG4gICAgbmV4dCgpXHJcbiAgICBcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmV0dXJuIG5leHQobmV3IFVuYXV0aG9yaXNlZEV4Y2VwdGlvbihcIlVuYXV0aG9yaXNlZCFcIiwgRXJyb3JDb2RlLlVOQVVUSE9SSVNFRCkpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGF1dGhNaWRkbGV3YXJlO1xyXG4iLCAiaW1wb3J0IHsgSHR0cEV4Y2VwdGlvbiB9IGZyb20gXCIuL3Jvb3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVbmF1dGhvcmlzZWRFeGNlcHRpb24gZXh0ZW5kcyBIdHRwRXhjZXB0aW9uIHtcclxuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgZXJyb3JDb2RlOiBudW1iZXIsIGVycm9ycz86IGFueSl7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSwgZXJyb3JDb2RlLCA0MDEsIGVycm9ycylcclxuICAgIH1cclxufSIsICJpbXBvcnQgeyBsb2dpbiwgbWUsIHNpZ251cCB9IGZyb20gXCJAL2JhY2tlbmQvY29udHJvbGxlcnMvYXV0aFwiO1xyXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiQC9iYWNrZW5kL2Vycm9yLWhhbmRsZXJcIjtcclxuaW1wb3J0IGF1dGhNaWRkbGV3YXJlIGZyb20gXCJAL2JhY2tlbmQvbWlkZGxld2FyZXMvYXV0aFwiO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5cclxuY29uc3QgYXV0aFJvdXRlczogUm91dGVyID0gUm91dGVyKCk7XHJcblxyXG5hdXRoUm91dGVzLnBvc3QoXCIvc2lnbnVwXCIsIGVycm9ySGFuZGxlcihzaWdudXApKTtcclxuYXV0aFJvdXRlcy5wb3N0KFwiL2xvZ2luXCIsIGVycm9ySGFuZGxlcihsb2dpbikpO1xyXG5hdXRoUm91dGVzLmdldChcIi9tZVwiLCBbYXV0aE1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIobWUpKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGF1dGhSb3V0ZXM7XHJcbiIsICJpbXBvcnQgeyBOb3RGb3VuZEV4Y2VwdGlvbiB9IGZyb20gXCIuLi9leGNlcHRpb25zL25vdC1mb3VuZFwiO1xyXG5pbXBvcnQgeyBFcnJvckNvZGUgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9yb290XCI7XHJcbmltcG9ydCB7IHByaXNtYUNsaWVudCB9IGZyb20gXCIuLy4uL3NlcnZlclwiO1xyXG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gXCJleHByZXNzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlUHJvZHVjdCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBjb25zdCBwcm9kdWN0ID0gYXdhaXQgcHJpc21hQ2xpZW50LnByb2R1Y3QuY3JlYXRlKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgLi4ucmVxLmJvZHksXHJcbiAgICB9LFxyXG4gIH0pO1xyXG4gIHJlcy5qc29uKHByb2R1Y3QpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVByb2R1Y3QgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBwcm9kdWN0ID0gcmVxLmJvZHk7XHJcbiAgICBjb25zdCB1cGRhdGVQcm9kdWN0ID0gYXdhaXQgcHJpc21hQ2xpZW50LnByb2R1Y3QudXBkYXRlKHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICBpZDogK3JlcS5wYXJhbXMuaWQsXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IHByb2R1Y3QsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIkhlcmUgaXMgdGhlIHVwZGF0ZWQgcHJvZHVjdCAtLS0tLS0tPlwiLCB1cGRhdGVQcm9kdWN0KTtcclxuICAgIHJlcy5qc29uKHVwZGF0ZVByb2R1Y3QpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXhjZXB0aW9uKFxyXG4gICAgICBcIlByb2R1Y3Qgbm90IGZvdW5kLlwiLFxyXG4gICAgICBFcnJvckNvZGUuUFJPRFVDVF9OT1RfRk9VTkRcclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVByb2R1Y3QgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgY29uc3QgZGVsZXRlUHJvZHVjdCA9IGF3YWl0IHByaXNtYUNsaWVudC5wcm9kdWN0LmRlbGV0ZSh7XHJcbiAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogK3JlcS5wYXJhbXMuaWQsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkhlcmUgaXMgdGhlIGRlbGV0ZWQgcHJvZHVjdCAtLS0tLS0tPlwiLCBkZWxldGVQcm9kdWN0KTtcclxuICAgICAgICByZXMuanNvbihkZWxldGVQcm9kdWN0KTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kRXhjZXB0aW9uKFxyXG4gICAgICAgICAgXCJQcm9kdWN0IG5vdCBmb3VuZC5cIixcclxuICAgICAgICAgIEVycm9yQ29kZS5QUk9EVUNUX05PVF9GT1VORFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBsaXN0UHJvZHVjdCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgIGNvbnN0IGNvdW50ID0gcHJpc21hQ2xpZW50LnByb2R1Y3QuY291bnQoKVxyXG4gICAgY29uc3QgcHJvZHVjdHMgPSBhd2FpdCBwcmlzbWFDbGllbnQucHJvZHVjdC5maW5kTWFueSh7XHJcbiAgICAgICAgc2tpcDogK3JlcS5xdWVyeS5za2lwIHx8IDAsXHJcbiAgICAgICAgdGFrZTogNVxyXG4gICAgfSlcclxuICAgIHJlcy5qc29uKHtcclxuICAgICAgICBjb3VudCwgZGF0YTpwcm9kdWN0c1xyXG4gICAgfSlcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRQcm9kdWN0QnlJZCA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcHJvZHVjdCA9IGF3YWl0IHByaXNtYUNsaWVudC5wcm9kdWN0LmZpbmRGaXJzdE9yVGhyb3coe1xyXG4gICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6ICtyZXEucGFyYW1zLmlkLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiSGVyZSBpcyB0aGUgYXNrZWQgcHJvZHVjdCAtLS0tLS0tPlwiLCBwcm9kdWN0KTtcclxuICAgICAgICByZXMuanNvbihwcm9kdWN0KTtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IE5vdEZvdW5kRXhjZXB0aW9uKFxyXG4gICAgICAgICAgXCJQcm9kdWN0IG5vdCBmb3VuZC5cIixcclxuICAgICAgICAgIEVycm9yQ29kZS5QUk9EVUNUX05PVF9GT1VORFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxufTtcclxuIiwgImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBVbmF1dGhvcmlzZWRFeGNlcHRpb24gfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy91bmF1dGhvcmlzZWQtZXhjZXB0aW9uXCI7XHJcbmltcG9ydCB7IEVycm9yQ29kZSB9IGZyb20gXCIuLi9leGNlcHRpb25zL3Jvb3RcIjtcclxuXHJcbmNvbnN0IGFkbWluTWlkZGxld2FyZSA9IGFzeW5jIChcclxuICByZXE6IFJlcXVlc3QsXHJcbiAgcmVzOiBSZXNwb25zZSxcclxuICBuZXh0OiBOZXh0RnVuY3Rpb25cclxuKSA9PiB7XHJcbiAgY29uc3QgdXNlciA9IHJlcS51c2VyO1xyXG5cclxuICBpZiAodXNlci5yb2xlID09IFwiQURNSU5cIikge1xyXG4gICAgbmV4dCgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBuZXh0KG5ldyBVbmF1dGhvcmlzZWRFeGNlcHRpb24oXCJVbmF1dGhvcml6ZWRcIiwgRXJyb3JDb2RlLlVOQVVUSE9SSVNFRCkpO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFkbWluTWlkZGxld2FyZTtcclxuIiwgImltcG9ydCB7IGNyZWF0ZVByb2R1Y3QsIGRlbGV0ZVByb2R1Y3QsIGdldFByb2R1Y3RCeUlkLCBsaXN0UHJvZHVjdCwgdXBkYXRlUHJvZHVjdCB9IGZyb20gXCJAL2JhY2tlbmQvY29udHJvbGxlcnMvcHJvZHVjdHNcIjtcclxuaW1wb3J0IHsgZXJyb3JIYW5kbGVyIH0gZnJvbSBcIkAvYmFja2VuZC9lcnJvci1oYW5kbGVyXCI7XHJcbmltcG9ydCBhZG1pbk1pZGRsZXdhcmUgZnJvbSBcIkAvYmFja2VuZC9taWRkbGV3YXJlcy9hZG1pblwiO1xyXG5pbXBvcnQgYXV0aE1pZGRsZXdhcmUgZnJvbSBcIkAvYmFja2VuZC9taWRkbGV3YXJlcy9hdXRoXCI7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XHJcblxyXG5jb25zdCBwcm9kdWN0Um91dGVzOiBSb3V0ZXIgPSBSb3V0ZXIoKVxyXG5cclxuXHJcblxyXG5wcm9kdWN0Um91dGVzLnBvc3QoJy8nLCBbYXV0aE1pZGRsZXdhcmUsIGFkbWluTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcihjcmVhdGVQcm9kdWN0KSlcclxucHJvZHVjdFJvdXRlcy5wdXQoJy86aWQnLCBbYXV0aE1pZGRsZXdhcmUsIGFkbWluTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcih1cGRhdGVQcm9kdWN0KSlcclxucHJvZHVjdFJvdXRlcy5kZWxldGUoJy86aWQnLCBbYXV0aE1pZGRsZXdhcmUsIGFkbWluTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcihkZWxldGVQcm9kdWN0KSlcclxucHJvZHVjdFJvdXRlcy5nZXQoJy8nLCBbYXV0aE1pZGRsZXdhcmUsIGFkbWluTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcihsaXN0UHJvZHVjdCkpXHJcbnByb2R1Y3RSb3V0ZXMuZ2V0KCcvOmlkJywgW2F1dGhNaWRkbGV3YXJlLCBhZG1pbk1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIoZ2V0UHJvZHVjdEJ5SWQpKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcHJvZHVjdFJvdXRlcyIsICJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiQC9iYWNrZW5kL2Vycm9yLWhhbmRsZXJcIjtcclxuaW1wb3J0IGF1dGhNaWRkbGV3YXJlIGZyb20gXCJAL2JhY2tlbmQvbWlkZGxld2FyZXMvYXV0aFwiO1xyXG5pbXBvcnQge1xyXG4gIGFkZEFkZHJlc3MsXHJcbiAgZGVsZXRlQWRkcmVzcyxcclxuICBsaXN0QWRkcmVzcyxcclxuICB1cGRhdGVVc2VyLFxyXG59IGZyb20gXCJAL2JhY2tlbmQvY29udHJvbGxlcnMvdXNlcnNcIjtcclxuXHJcbmNvbnN0IHVzZXJzUm91dGVzOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcclxuXHJcbnVzZXJzUm91dGVzLnBvc3QoXCIvYWRkcmVzc1wiLCBbYXV0aE1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIoYWRkQWRkcmVzcykpO1xyXG51c2Vyc1JvdXRlcy5kZWxldGUoXHJcbiAgXCIvYWRkcmVzcy86aWRcIixcclxuICBbYXV0aE1pZGRsZXdhcmVdLFxyXG4gIGVycm9ySGFuZGxlcihkZWxldGVBZGRyZXNzKVxyXG4pO1xyXG51c2Vyc1JvdXRlcy5nZXQoXCJhZGRyZXNzXCIsIFthdXRoTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcihsaXN0QWRkcmVzcykpO1xyXG5cclxudXNlcnNSb3V0ZXMucHV0KFwiL1wiLCBbYXV0aE1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIodXBkYXRlVXNlcikpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdXNlcnNSb3V0ZXM7XHJcbiIsICJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7IEFkZHJlc3NTY2hlbWEsIFVwZGF0ZVVzZXJTY2hlbWEgfSBmcm9tIFwiLi4vc2NoZW1hL3VzZXJzXCI7XHJcbmltcG9ydCB7IHByaXNtYUNsaWVudCB9IGZyb20gXCIuLi9zZXJ2ZXJcIjtcclxuaW1wb3J0IHsgTm90Rm91bmRFeGNlcHRpb24gfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9ub3QtZm91bmRcIjtcclxuaW1wb3J0IHsgRXJyb3JDb2RlIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvcm9vdFwiO1xyXG5pbXBvcnQgeyBBZGRyZXNzIH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcbmltcG9ydCB7IEJhZFJlcXVlc3RzRXhjZXB0aW9uIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvYmFkLXJlcXVlc3RzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYWRkQWRkcmVzcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBBZGRyZXNzU2NoZW1hLnBhcnNlKHJlcS5ib2R5KTtcclxuICBjb25zdCBhZGRyZXNzID0gYXdhaXQgcHJpc21hQ2xpZW50LmFkZHJlc3MuY3JlYXRlKHtcclxuICAgIGRhdGE6IHtcclxuICAgICAgLi4ucmVxLmJvZHksXHJcbiAgICAgIHVzZXJJZDogcmVxLnVzZXIuaWQsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG4gIHJlcy5qc29uKGFkZHJlc3MpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUFkZHJlc3MgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGF3YWl0IHByaXNtYUNsaWVudC5hZGRyZXNzLmRlbGV0ZSh7XHJcbiAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgaWQ6ICtyZXEucGFyYW1zLmlkLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgICByZXMuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFeGNlcHRpb24oXHJcbiAgICAgIFwiQWRkcmVzcyBub3QgZm91bmRcIixcclxuICAgICAgRXJyb3JDb2RlLkFERFJFU1NfTk9UX0ZPVU5EXHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBsaXN0QWRkcmVzcyA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBjb25zdCBhZGRyZXNzZXMgPSBhd2FpdCBwcmlzbWFDbGllbnQuYWRkcmVzcy5maW5kTWFueSh7XHJcbiAgICB3aGVyZToge1xyXG4gICAgICB1c2VySWQ6IHJlcS51c2VyLmlkLFxyXG4gICAgfSxcclxuICB9KTtcclxuICByZXMuanNvbihhZGRyZXNzZXMpO1xyXG59O1xyXG5cclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlVXNlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICBjb25zdCB2YWxpZGF0ZWREYXRhID0gVXBkYXRlVXNlclNjaGVtYS5wYXJzZShyZXEuYm9keSk7XHJcblxyXG4gIGxldCBzaGlwcGluZ0FkZHJlc3M6IEFkZHJlc3M7XHJcbiAgbGV0IGJpbGxpbmdBZGRyZXNzOiBBZGRyZXNzO1xyXG5cclxuICBpZiAodmFsaWRhdGVkRGF0YS5kZWZhdWx0U2hpcHBpbmdBZGRyZXNzKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBzaGlwcGluZ0FkZHJlc3MgPSBhd2FpdCBwcmlzbWFDbGllbnQuYWRkcmVzcy5maW5kRmlyc3RPclRocm93KHtcclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgaWQ6IHZhbGlkYXRlZERhdGEuZGVmYXVsdFNoaXBwaW5nQWRkcmVzcyxcclxuICAgICAgICB9LFxyXG4gICAgICB9KVxyXG4gICAgIFxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHRocm93IG5ldyBOb3RGb3VuZEV4Y2VwdGlvbihcclxuICAgICAgICBcIkFkZHJlc3Mgbm90IGZvdW5kXCIsXHJcbiAgICAgICAgRXJyb3JDb2RlLkFERFJFU1NfTk9UX0ZPVU5EXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZihzaGlwcGluZ0FkZHJlc3MudXNlcklkICE9IHJlcS51c2VyLmlkKXtcclxuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RzRXhjZXB0aW9uKFwiQWRkcmVzcyBkb2VzIG5vdCBiZWxvbmcgdG8gdXNlciFcIiwgRXJyb3JDb2RlLkFERFJFU1NfRE9FU19OT1RfTUFUQ0gpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAodmFsaWRhdGVkRGF0YS5kZWZhdWx0QmlsbGluZ0FkZHJlc3MpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGJpbGxpbmdBZGRyZXNzID0gYXdhaXQgcHJpc21hQ2xpZW50LmFkZHJlc3MuZmluZEZpcnN0T3JUaHJvdyh7XHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgIGlkOiB2YWxpZGF0ZWREYXRhLmRlZmF1bHRCaWxsaW5nQWRkcmVzcyxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICB0aHJvdyBuZXcgTm90Rm91bmRFeGNlcHRpb24oXHJcbiAgICAgICAgXCJBZGRyZXNzIG5vdCBmb3VuZFwiLFxyXG4gICAgICAgIEVycm9yQ29kZS5BRERSRVNTX05PVF9GT1VORFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYoYmlsbGluZ0FkZHJlc3MudXNlcklkICE9IHJlcS51c2VyLmlkKXtcclxuICAgICAgdGhyb3cgbmV3IEJhZFJlcXVlc3RzRXhjZXB0aW9uKFwiQWRkcmVzcyBkb2VzIG5vdCBiZWxvbmcgdG8gdXNlciFcIiwgRXJyb3JDb2RlLkFERFJFU1NfRE9FU19OT1RfTUFUQ0gpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCB1cGRhdGVkVXNlciA9IGF3YWl0IHByaXNtYUNsaWVudC51c2VyLnVwZGF0ZSh7XHJcbiAgICB3aGVyZToge1xyXG4gICAgICAgIGlkOiByZXEudXNlci5pZFxyXG4gICAgfSxcclxuICAgIGRhdGE6IHZhbGlkYXRlZERhdGFcclxuICB9KVxyXG4gIHJlcy5qc29uKHVwZGF0ZWRVc2VyKVxyXG59O1xyXG4iLCAiaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIlxyXG5cclxuZXhwb3J0IGNvbnN0IENyZWF0ZUNhcnRTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgICBwcm9kdWN0SWQ6IHoubnVtYmVyKCksXHJcbiAgICBxdWFudGl0eTogei5udW1iZXIoKSxcclxufSlcclxuXHJcbmV4cG9ydCBjb25zdCBDaGFuZ2VRdWFudGl0eVNjaGVtYSA9IHoub2JqZWN0KHtcclxuICAgIHF1YW50aXR5OiB6Lm51bWJlcigpLFxyXG59KVxyXG4iLCAiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBDaGFuZ2VRdWFudGl0eVNjaGVtYSwgQ3JlYXRlQ2FydFNjaGVtYSB9IGZyb20gXCIuLi9zY2hlbWEvY2FydFwiO1xyXG5pbXBvcnQgeyBOb3RGb3VuZEV4Y2VwdGlvbiB9IGZyb20gXCIuLi9leGNlcHRpb25zL25vdC1mb3VuZFwiO1xyXG5pbXBvcnQgeyBQcm9kdWN0IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcbmltcG9ydCB7IEVycm9yQ29kZSB9IGZyb20gXCIuLi9leGNlcHRpb25zL3Jvb3RcIjtcclxuaW1wb3J0IHsgcHJpc21hQ2xpZW50IH0gZnJvbSBcIi4uL3NlcnZlclwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGFkZEl0ZW1Ub0NhcnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICAvL2NoZWNrIGlmIHRoZSBzYW1lIHByb2R1Y3QgaXMgYWxyZWFkeSB0aGVyZSB0aGVuIGNoYW5nZSB0aGUgcXVhbnRpdHkgYXMgcmVxdWlyZWRcclxuICAgIGNvbnN0IHZhbGlkYXRlZERhdGEgPSBDcmVhdGVDYXJ0U2NoZW1hLnBhcnNlKHJlcS5ib2R5KVxyXG4gICAgbGV0IHByb2R1Y3Q6IFByb2R1Y3RcclxuICAgIHRyeSB7XHJcbiAgICAgICBwcm9kdWN0ID0gYXdhaXQgcHJpc21hQ2xpZW50LnByb2R1Y3QuZmluZEZpcnN0T3JUaHJvdyh7XHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IHZhbGlkYXRlZERhdGEucHJvZHVjdElkXHJcbiAgICAgICAgfVxyXG4gICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgICBjYXRjaChlcnIpe1xyXG4gICAgICAgIHRocm93IG5ldyBOb3RGb3VuZEV4Y2VwdGlvbihcIlByb2R1Y3Qgbm90IGZvdW5kIVwiLCBFcnJvckNvZGUuUFJPRFVDVF9OT1RfRk9VTkQpXHJcbiAgICB9XHJcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgcHJpc21hQ2xpZW50LmNhcnRJdGVtLmNyZWF0ZSh7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICB1c2VySWQ6IHJlcS51c2VyLmlkLFxyXG4gICAgICAgICAgICBwcm9kdWN0SWQ6IHByb2R1Y3QuaWQsXHJcbiAgICAgICAgICAgIHF1YW50aXR5OiB2YWxpZGF0ZWREYXRhLnF1YW50aXR5XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJlcy5qc29uKGNhcnQpXHJcblxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlSXRlbUZyb21DYXJ0ID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG5cclxuLy9Vc2VyIHNob3VsZCBkZWxldGUgaXQncyBvd24gY2FydCBpdGVtIC0tLS0+IElmIGNhcnRJdGVtLnVzZXIuaWQgIT0gbG9nZ2VkIGluIHVzZXIgPT4gdGhyb3cgZXJyb3JcclxuICAgIGF3YWl0IHByaXNtYUNsaWVudC5jYXJ0SXRlbS5kZWxldGUoe1xyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgIGlkOiArcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXMuanNvbih7c3VjY2VzczogdHJ1ZX0pXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjaGFuZ2VRdWFudGl0eSA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAgIC8vIFVzZXIgc2hvdWxkIHVwZGF0ZSBpdHMgb3duIGNhcnQgSXRlbVxyXG4gICAgY29uc3QgdmFsaWRhdGVkRGF0YT0gQ2hhbmdlUXVhbnRpdHlTY2hlbWEucGFyc2UocmVxLmJvZHkpXHJcbiAgICBjb25zdCB1cGRhdGVkQ2FydCA9ICBhd2FpdCBwcmlzbWFDbGllbnQuY2FydEl0ZW0udXBkYXRlKHtcclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBpZDogK3JlcS5wYXJhbXMuaWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgcXVhbnRpdHk6IHZhbGlkYXRlZERhdGEucXVhbnRpdHlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmVzLmpzb24odXBkYXRlZENhcnQpXHJcbiAgICBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldENhcnQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0ID0gYXdhaXQgcHJpc21hQ2xpZW50LmNhcnRJdGVtLmZpbmRNYW55KHtcclxuICAgICAgICB3aGVyZTp7XHJcbiAgICAgICAgICAgIHVzZXJJZDogcmVxLnVzZXIuaWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGluY2x1ZGU6e1xyXG4gICAgICAgICAgICBwcm9kdWN0OiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJlcy5qc29uKGNhcnQpXHJcbn0iLCAiaW1wb3J0IHtcclxuICBhZGRJdGVtVG9DYXJ0LFxyXG4gIGNoYW5nZVF1YW50aXR5LFxyXG4gIGRlbGV0ZUl0ZW1Gcm9tQ2FydCxcclxuICBnZXRDYXJ0LFxyXG59IGZyb20gXCJAL2JhY2tlbmQvY29udHJvbGxlcnMvY2FydFwiO1xyXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIgfSBmcm9tIFwiQC9iYWNrZW5kL2Vycm9yLWhhbmRsZXJcIjtcclxuXHJcbmltcG9ydCBhdXRoTWlkZGxld2FyZSBmcm9tIFwiQC9iYWNrZW5kL21pZGRsZXdhcmVzL2F1dGhcIjtcclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuXHJcbmNvbnN0IGNhcnRSb3V0ZXM6IFJvdXRlciA9IFJvdXRlcigpO1xyXG5cclxuY2FydFJvdXRlcy5wb3N0KFwiL1wiLCBbYXV0aE1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIoYWRkSXRlbVRvQ2FydCkpO1xyXG5jYXJ0Um91dGVzLmdldChcIi9cIiwgW2F1dGhNaWRkbGV3YXJlXSwgZXJyb3JIYW5kbGVyKGdldENhcnQpKTtcclxuY2FydFJvdXRlcy5kZWxldGUoXCIvOmlkXCIsIFthdXRoTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcihkZWxldGVJdGVtRnJvbUNhcnQpKTtcclxuY2FydFJvdXRlcy5wdXQoXCIvOmlkXCIsIFthdXRoTWlkZGxld2FyZV0sIGVycm9ySGFuZGxlcihjaGFuZ2VRdWFudGl0eSkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2FydFJvdXRlcztcclxuIiwgImltcG9ydCB7IFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHsgcHJpc21hQ2xpZW50IH0gZnJvbSBcIi4uL3NlcnZlclwiO1xyXG5pbXBvcnQgeyBOb3RGb3VuZEV4Y2VwdGlvbiB9IGZyb20gXCIuLi9leGNlcHRpb25zL25vdC1mb3VuZFwiO1xyXG5pbXBvcnQgeyBFcnJvckNvZGUgfSBmcm9tIFwiLi4vZXhjZXB0aW9ucy9yb290XCI7XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlT3JkZXIgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgcmV0dXJuIGF3YWl0IHByaXNtYUNsaWVudC4kdHJhbnNhY3Rpb24oYXN5bmMgKHR4KSA9PiB7XHJcbiAgICBjb25zdCBjYXJ0SXRlbXMgPSBhd2FpdCB0eC5jYXJ0SXRlbS5maW5kTWFueSh7XHJcbiAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgdXNlcklkOiByZXEudXNlci5pZCxcclxuICAgICAgfSxcclxuICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgIHByb2R1Y3Q6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIGlmIChjYXJ0SXRlbXMubGVuZ3RoID09IDApIHtcclxuICAgICAgcmV0dXJuIHJlcy5qc29uKHsgbWVzc2FnZTogXCJjYXJ0IGlzIGVtcHR5XCIgfSk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwcmljZSA9IGNhcnRJdGVtcy5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpID0+IHtcclxuICAgICAgcmV0dXJuIHByZXYgKyBjdXJyZW50LnF1YW50aXR5ICogK2N1cnJlbnQucHJvZHVjdC5wcmljZTtcclxuICAgIH0sIDApO1xyXG4gICAgY29uc3QgYWRkcmVzcyA9IGF3YWl0IHR4LmFkZHJlc3MuZmluZEZpcnN0KHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICBpZDogcmVxLnVzZXIuZGVmYXVsdFNoaXBwaW5nQWRkcmVzcyxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgdHgub3JkZXIuY3JlYXRlKHtcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHVzZXJJZDogcmVxLnVzZXIuaWQsXHJcbiAgICAgICAgbmV0QW1vdW50OiBwcmljZSxcclxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzLmZvcm1hdHRlZEFkZHJlc3MsXHJcbiAgICAgICAgcHJvZHVjdHM6IHtcclxuICAgICAgICAgIGNyZWF0ZTogY2FydEl0ZW1zLm1hcCgoY2FydCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgIHByb2R1Y3RJZDogY2FydC5wcm9kdWN0SWQsXHJcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IGNhcnQucXVhbnRpdHksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBvcmRlckV2ZW50ID0gYXdhaXQgdHgub3JkZXJFdmVudC5jcmVhdGUoe1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgb3JkZXJJZDogb3JkZXIuaWQsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIGF3YWl0IHR4LmNhcnRJdGVtLmRlbGV0ZU1hbnkoe1xyXG4gICAgICB3aGVyZToge1xyXG4gICAgICAgIHVzZXJJZDogcmVxLnVzZXIuaWQsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXMuanNvbihvcmRlcik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgbGlzdE9yZGVyID0gYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gIGNvbnN0IG9yZGVyID0gYXdhaXQgcHJpc21hQ2xpZW50Lm9yZGVyLmZpbmRNYW55KHtcclxuICAgIHdoZXJlOiB7XHJcbiAgICAgIHVzZXJJZDogcmVxLnVzZXIuaWQsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG4gIHJlcy5qc29uKG9yZGVyKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjYW5jZWxPcmRlciA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcclxuICAvL3dyYXAgaXQgaW5zaWRlIGEgdHJhbnNhY3Rpb25cclxuICAvL2NoZWNrIGlmIHVzZXIgaXMgY2FuY2VsbGluZyBpdHMgb3duIG9yZGVyXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgcHJpc21hQ2xpZW50Lm9yZGVyLnVwZGF0ZSh7XHJcbiAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgaWQ6ICtyZXEucGFyYW1zLmlkLFxyXG4gICAgICB9LFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgc3RhdHVzOiBcIkNBTkNFTExFRFwiLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgICBhd2FpdCBwcmlzbWFDbGllbnQub3JkZXJFdmVudC5jcmVhdGUoe1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgb3JkZXJJZDogb3JkZXIuaWQsXHJcbiAgICAgICAgc3RhdHVzOiBcIkNBTkNFTExFRFwiLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcbiAgICByZXMuanNvbihvcmRlcik7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICB0aHJvdyBuZXcgTm90Rm91bmRFeGNlcHRpb24oJ09yZGVyIG5vdCBmb3VuZCEnLCBFcnJvckNvZGUuT1JERVJfTk9UX0ZPVU5EKVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRPcmRlckJ5SWQgPSBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgcHJpc21hQ2xpZW50Lm9yZGVyLmZpbmRGaXJzdE9yVGhyb3coe1xyXG4gICAgICB3aGVyZToge1xyXG4gICAgICAgIGlkOiArcmVxLnBhcmFtcy5pZCxcclxuICAgICAgfSxcclxuICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgIHByb2R1Y3RzOiB0cnVlLFxyXG4gICAgICAgIGV2ZW50czogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gICAgcmVzLmpzb24ob3JkZXIpO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgdGhyb3cgbmV3IE5vdEZvdW5kRXhjZXB0aW9uKFwiT3JkZXIgbm90IGZvdW5kIVwiLCBFcnJvckNvZGUuT1JERVJfTk9UX0ZPVU5EKTtcclxuICB9XHJcbn07XHJcbiIsICJpbXBvcnQgeyBjYW5jZWxPcmRlciwgY3JlYXRlT3JkZXIsIGdldE9yZGVyQnlJZCwgbGlzdE9yZGVyIH0gZnJvbSBcIkAvYmFja2VuZC9jb250cm9sbGVycy9vcmRlcnNcIjtcclxuaW1wb3J0IHsgZXJyb3JIYW5kbGVyIH0gZnJvbSBcIkAvYmFja2VuZC9lcnJvci1oYW5kbGVyXCI7XHJcbmltcG9ydCBhZG1pbk1pZGRsZXdhcmUgZnJvbSBcIkAvYmFja2VuZC9taWRkbGV3YXJlcy9hZG1pblwiO1xyXG5pbXBvcnQgYXV0aE1pZGRsZXdhcmUgZnJvbSBcIkAvYmFja2VuZC9taWRkbGV3YXJlcy9hdXRoXCI7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XHJcblxyXG5jb25zdCBvcmRlclJvdXRlczogUm91dGVyID0gUm91dGVyKClcclxuXHJcblxyXG5cclxub3JkZXJSb3V0ZXMucG9zdCgnLycsIFthdXRoTWlkZGxld2FyZSwgYWRtaW5NaWRkbGV3YXJlXSwgZXJyb3JIYW5kbGVyKGNyZWF0ZU9yZGVyKSlcclxub3JkZXJSb3V0ZXMucHV0KCcvOmlkL2NhbmNlbCcsIFthdXRoTWlkZGxld2FyZSwgYWRtaW5NaWRkbGV3YXJlXSwgZXJyb3JIYW5kbGVyKGNhbmNlbE9yZGVyKSlcclxub3JkZXJSb3V0ZXMuZ2V0KCcvJywgW2F1dGhNaWRkbGV3YXJlLCBhZG1pbk1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIobGlzdE9yZGVyKSlcclxub3JkZXJSb3V0ZXMuZ2V0KCcvOmlkJywgW2F1dGhNaWRkbGV3YXJlLCBhZG1pbk1pZGRsZXdhcmVdLCBlcnJvckhhbmRsZXIoZ2V0T3JkZXJCeUlkKSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG9yZGVyUm91dGVzIiwgImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgeyBIdHRwRXhjZXB0aW9uIH0gZnJvbSBcIi4uL2V4Y2VwdGlvbnMvcm9vdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVycm9yTWlkZGxld2FyZSA9IChlcnJvcjogSHR0cEV4Y2VwdGlvbiwgcmVxOlJlcXVlc3QsIHJlczpSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XHJcbiAgICByZXMuc3RhdHVzKGVycm9yLnN0YXR1c0NvZGUpLmpzb24oe1xyXG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXHJcbiAgICAgICAgZXJyb3JDb2RlOiBlcnJvci5lcnJv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QVEsSUFBSSxJQUFJO0FBRWhCLElBQUksSUFBSSxRQUFRLEtBQUssQ0FBQztBQUV0QixJQUFJLElBQUksUUFBUSxjQUFVO0FBRW5CLElBQU0sZUFBZSxJQUFJLGFBQWE7QUFBQSxFQUN6QyxLQUFJLENBQUMsT0FBTztBQUNoQixDQUFDLEVBQUUsU0FBUztBQUFBLEVBQ1YsUUFBTztBQUFBLElBQ0wsU0FBUTtBQUFBLE1BQ04sa0JBQWlCO0FBQUEsUUFDZixPQUFPO0FBQUEsVUFDTCxTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsVUFDVCxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsUUFDWDtBQUFBLFFBQ0EsU0FBUyxDQUFDLFNBQVM7QUFDakIsaUJBQVEsR0FBRyxLQUFLLFlBQVksS0FBSyxZQUFZLEtBQUssU0FBUyxLQUFLLFdBQVcsS0FBSztBQUFBLFFBQ2xGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQztBQUVELElBQUksSUFBSSxlQUFlO0FBRXZCLElBQUksT0FBTyxNQUFNLE1BQU07QUFDckIsVUFBUSxJQUFJLG1EQUFtRCxNQUFNO0FBQ3ZFLENBQUM7IiwKICAibmFtZXMiOiBbImRvdGVudiIsICJSb3V0ZXIiLCAianNvbndlYnRva2VuIiwgImpzb253ZWJ0b2tlbiIsICJhdXRoX2RlZmF1bHQiLCAidXBkYXRlUHJvZHVjdCIsICJkZWxldGVQcm9kdWN0IiwgIlJvdXRlciIsICJSb3V0ZXIiLCAiUm91dGVyIiwgInoiLCAiUm91dGVyIiwgIlJvdXRlciIsICJSb3V0ZXIiLCAiYXV0aF9kZWZhdWx0IiwgImRvdGVudiJdCn0K

	