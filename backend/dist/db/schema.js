"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRelations = exports.productRelations = exports.userRelations = exports.comments = exports.products = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "date" }).defaultNow().notNull(),
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "date" }).defaultNow().notNull(),
});
exports.comments = (0, pg_core_1.pgTable)("comments", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    content: (0, pg_core_1.text)("content").notNull(),
    userId: (0, pg_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    productId: (0, pg_core_1.uuid)("product_id")
        .notNull()
        .references(() => exports.products.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "date" }).defaultNow().notNull(),
});
exports.userRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    products: many(exports.products),
    comments: many(exports.comments),
}));
exports.productRelations = (0, drizzle_orm_1.relations)(exports.products, ({ one, many }) => ({
    user: one(exports.users, { fields: [exports.products.userId], references: [exports.users.id] }),
    comments: many(exports.comments),
}));
exports.commentRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one }) => ({
    user: one(exports.users, { fields: [exports.comments.userId], references: [exports.users.id] }),
    product: one(exports.products, { fields: [exports.comments.productId], references: [exports.products.id] }),
}));
