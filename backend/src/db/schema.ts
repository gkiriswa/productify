import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";



export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});


export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});


export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
    products: many(products),
    comments: many(comments),
}));


export const productRelations = relations(products, ({ one, many }) => ({
    user: one(users, { fields: [products.userId], references: [users.id] }),
    comments: many(comments),

}));


export const commentRelations = relations(comments, ({ one }) => ({
    user: one(users, { fields: [comments.userId], references: [users.id] }),
    product: one(products, { fields: [comments.productId], references: [products.id] }),
}));


export type user = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;