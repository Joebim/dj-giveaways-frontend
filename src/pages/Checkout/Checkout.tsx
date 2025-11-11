import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaLock, FaShoppingBag } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "../../components/common/Button/Button";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  notes: string;
  marketingOptIn: boolean;
}

const inputClasses =
  "w-full px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 focus:border-gold-primary transition-all font-light";

const Checkout: React.FC = () => {
  const { items, subtotal, total, itemCount, fetchCart, isLoading } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: "",
    country: "United Kingdom",
    notes: "",
    marketingOptIn: user?.subscribedToNewsletter ?? false,
  });

  useEffect(() => {
    fetchCart().catch(() => {
      // Commented out error toast for dummy data
      // toast.error("Unable to load cart. Please refresh and try again.");
    });
  }, [fetchCart]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: user?.firstName ?? prev.firstName,
      lastName: user?.lastName ?? prev.lastName,
      email: user?.email ?? prev.email,
      phone: user?.phone ?? prev.phone,
      marketingOptIn: user?.subscribedToNewsletter ?? prev.marketingOptIn,
    }));
  }, [user]);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
      }),
    []
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const isCheckbox =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox";
    const nextValue = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      // Commented out error toast for dummy data - just return silently
      // toast.error("Your cart is empty. Add tickets before checking out.");
      return;
    }

    toast.success("Checkout form captured. Stripe integration will submit this payload when ready.");
    console.groupCollapsed("Checkout Submission");
    console.log("Customer details", formData);
    console.log("Cart items", items);
    console.log("Order total", total);
    console.groupEnd();
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="bg-black-soft border border-gold-primary/20 rounded-2xl p-12 text-center">
            <FaShoppingBag className="w-16 h-16 text-gold-primary mx-auto mb-6" />
            <h1 className="text-4xl font-light text-white mb-3">Ready for your next win?</h1>
            <p className="text-white/70 mb-8">
              Your cart is currently empty. Head back to our live competitions and lock in those entries.
            </p>
            <div className="max-w-sm mx-auto">
              <Link to="/competitions">
                <Button variant="primary" size="lg" fullWidth withBrackets>
                  Browse Competitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm uppercase tracking-widest text-gold-primary/80 font-semibold mb-2">
              Secure Checkout
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-white">Complete Your Entry</h1>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold-primary hover:text-gold-light transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Return to cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-10"
          >
            {/* Contact Information */}
            <section className="bg-black-soft border border-gold-primary/20 rounded-2xl p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">Contact Details</h2>
                <p className="text-white/60 font-light">
                  We’ll use this information to send your ticket confirmation and contact you if you win.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="+44 7700 900123"
                  />
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="bg-black-soft border border-gold-primary/20 rounded-2xl p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2">Billing Address</h2>
                <p className="text-white/60 font-light">
                  Prizes and documentation will be delivered to this address. Please double-check the details.
                </p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                    placeholder="132 Tamnamore Road"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                    Address Line 2 (optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="Dungannon"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                      County / Region
                    </label>
                    <input
                      type="text"
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="County Tyrone"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                      Postcode
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="BT71 6HW"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder="United Kingdom"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-white/60 mb-2 font-light">
                  Order Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Any special delivery instructions or additional information."
                />
              </div>
              <label className="flex items-start gap-3 text-white/70 font-light">
                <input
                  type="checkbox"
                  name="marketingOptIn"
                  checked={formData.marketingOptIn}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gold-primary/40 bg-black focus:ring-gold-primary/40"
                />
                <span>
                  Keep me in the loop about new competitions, early bird discounts, and champion announcements.
                </span>
              </label>
            </section>

            {/* Payment */}
            <section className="bg-black-soft border border-gold-primary/20 rounded-2xl p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-light text-white mb-2 flex items-center gap-3">
                  <FaCreditCard className="text-gold-primary" />
                  Payment Details
                </h2>
                <p className="text-white/60 font-light">
                  We’ll process your payment securely via Stripe. Card entry will be enabled once backend integration is complete.
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-gold-primary/40 bg-black/40 p-8 text-center text-white/60 font-light">
                Stripe Elements placeholder — when the `/checkout/payment-intent` endpoint is live,
                the card widget will mount here to capture payment.
              </div>
              <p className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest">
                <FaLock className="text-gold-primary" />
                PCI compliant — powered by Stripe
              </p>

              <div className="pt-2 space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  withBrackets
                >
                  Review & Pay {currency.format(total)}
                </Button>
                <p className="text-xs text-white/50 text-center leading-relaxed">
                  By placing this order you agree to our{" "}
                  <Link to="/terms" className="text-gold-primary hover:text-gold-light transition-colors">
                    Terms & Conditions
                  </Link>{" "}
                  and confirm that all entries comply with our{" "}
                  <Link to="/acceptable-use" className="text-gold-primary hover:text-gold-light transition-colors">
                    Acceptable Use Policy
                  </Link>.
                </p>
              </div>
            </section>
          </form>

          {/* Summary */}
          <aside className="bg-black-soft border border-gold-primary/20 rounded-2xl p-8 h-fit space-y-8">
            <div>
              <h2 className="text-2xl font-light text-white mb-1">Order Summary</h2>
              <p className="text-white/60 font-light">
                {itemCount} {itemCount === 1 ? "ticket" : "tickets"} ready for the next draw.
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border border-gold-primary/20 rounded-xl p-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gold-primary/20 flex-shrink-0 bg-black">
                    {item.competition?.image ? (
                      <img
                        src={item.competition.image}
                        alt={item.competition?.title ?? "Competition"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40 text-xs text-center px-2">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      {item.competition?.title ?? "Competition"}
                    </h3>
                    <p className="text-white/60 text-sm font-light mb-2">
                      {item.quantity} x {currency.format(item.unitPrice)}
                    </p>
                    <p className="text-gold-primary font-semibold">
                      {currency.format(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gold-primary/10 pt-4">
              <div className="flex items-center justify-between text-white/70 font-light">
                <span>Subtotal</span>
                <span>{currency.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-white/70 font-light">
                <span>Booking Fees</span>
                <span>{currency.format(0)}</span>
              </div>
              <div className="flex items-center justify-between text-white/70 font-light">
                <span>Tax</span>
                <span>{currency.format(0)}</span>
              </div>
              <div className="flex items-center justify-between text-white font-semibold text-lg border-t border-gold-primary/20 pt-4">
                <span>Total</span>
                <span>{currency.format(total)}</span>
              </div>
                </div>

            <div className="bg-black border border-gold-primary/20 rounded-xl p-4 text-sm text-white/60 font-light">
              <p>
                All competitions include free entry routes. Make sure you have answered the qualifying question correctly —
                only correct entries are entered into the final draw.
              </p>
            </div>
          </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
