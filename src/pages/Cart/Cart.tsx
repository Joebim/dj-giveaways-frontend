import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useCartStore } from "../../store/useCartStore";
import Button from "../../components/common/Button/Button";

const fallbackImage = "https://via.placeholder.com/150?text=No+Image";

const Cart: React.FC = () => {
  const { cart, isLoading, fetchCart, updateItem, removeItem, clearCart } =
    useCartStore();

  useEffect(() => {
    fetchCart().catch(() => {
      // Errors handled inside store with toast elsewhere
    });
  }, [fetchCart]);

  const items = cart?.items ?? [];
  const totals = cart?.totals ?? { items: 0, subtotal: 0, totalTickets: 0 };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateItem(itemId, { quantity: newQuantity });
    }
  };

  const handleRemove = async (itemId: string) => {
    await removeItem(itemId);
  };

  if (!isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaShoppingCart className="w-24 h-24 text-gold-primary/30 mx-auto mb-6" />
              <h2 className="text-3xl font-light text-white mb-4  gold-text-glow">
                Your Cart is Empty
              </h2>
              <p className="text-white/70 mb-8">
                Start adding competitions to your cart!
              </p>
              <Link to="/competitions">
                <Button variant="primary" size="lg" withBrackets>
                  Browse Competitions
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const tax = 0;
  const finalSubtotal = totals.subtotal;

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-2  gold-text-glow">
            Shopping Cart
          </h1>
          <p className="text-white/70">Review your competition entries</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 bg-black-soft border border-gold-primary/10 rounded-lg animate-pulse"
                />
              ))}
            </div>
            <div className="h-64 bg-black-soft border border-gold-primary/10 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const competition = item.competition;
                const image = competition?.image ?? fallbackImage;
                const title = competition?.title ?? "Competition";
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black border border-gold-primary/20 rounded-lg p-6 hover:border-gold-primary/50 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden border border-gold-primary/20 bg-black/50">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = fallbackImage;
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-light text-white mb-2">
                          {title}
                        </h3>
                        <p className="text-white/70 text-sm mb-4">
                          Ticket Price:{" "}
                          <span className="text-gold-primary font-semibold">
                            £{item.unitPrice.toFixed(2)}
                          </span>
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-white/80 text-sm font-semibold">
                            Quantity:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border-2 border-gold-primary/50 rounded hover:border-gold-primary hover:bg-gold-primary/10 transition-colors text-gold-primary"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="w-12 text-center text-white font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border-2 border-gold-primary/50 rounded hover:border-gold-primary hover:bg-gold-primary/10 transition-colors text-gold-primary"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gold-primary">
                            £{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2"
                            aria-label="Remove item"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <div className="flex justify-end">
                <button
                  onClick={() => clearCart()}
                  className="text-white/70 hover:text-red-400 transition-colors text-sm font-semibold"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-black border border-gold-primary/20 rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-light text-white mb-6  gold-text-glow">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-white/80">
                    <span>
                      Subtotal ({totals.totalTickets}{" "}
                      {totals.totalTickets === 1 ? "ticket" : "tickets"})
                    </span>
                    <span className="font-semibold">
                      £{finalSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Tax</span>
                    <span className="font-semibold">£{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gold-primary/20 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-3xl font-light text-gold-primary  gold-text-glow">
                        £{(finalSubtotal + tax).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button variant="primary" size="lg" fullWidth withBrackets>
                    Checkout
                  </Button>
                </Link>

                <Link
                  to="/competitions"
                  className="block mt-4 text-center text-gold-primary hover:text-gold-light transition-colors text-sm font-semibold"
                >
                  Continue Shopping →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
