import { Component } from '@angular/core';

// one copy of the actual wording, shared by the signup step and the public /terms page
@Component({
  selector: 'app-terms-content',
  template: `
    <div class="terms">
      <p class="updated">Last updated 1 September 2026</p>

      <h2>1. Accepting these terms</h2>
      <p>
        Relish is an online ordering service that connects you with restaurants in your area and arranges
        delivery of the food you order from them. By creating an account you agree to these terms. If you
        do not agree with them, don't create an account - you can keep browsing without one.
      </p>

      <h2>2. Your account</h2>
      <p>
        You need to be 18 or over to hold an account. We log you in with a one-time code sent to your email
        address, so keep access to that inbox secure - anyone who can read your email can sign in as you.
        One account per person, and the details you give us should be accurate. Let us know if you think
        somebody else has been using your account.
      </p>

      <h2>3. Orders and prices</h2>
      <p>
        Prices are set by the restaurants, not by us, and are shown inclusive of applicable taxes. A delivery
        fee is added at checkout and shown to you before you confirm. Placing an order is an offer to buy;
        the order is only accepted once the restaurant confirms it. If an item turns out to be unavailable
        the restaurant may reject the order, and you won't be charged for it.
      </p>

      <h2>4. Delivery</h2>
      <p>
        Delivery times shown in the app are estimates and depend on the restaurant, traffic and weather. We
        deliver to the address you pick at checkout, so please make sure it's correct and that someone can
        receive the order. If a courier can't reach you after a reasonable effort, the order may be treated
        as delivered.
      </p>

      <h2>5. Cancellations and refunds</h2>
      <p>
        You can cancel free of charge until the restaurant starts preparing your order. After that, because
        the food is made fresh to order, cancellation isn't usually possible. If something arrives missing,
        cold or plainly wrong, tell us within 48 hours and we'll look into it and refund where it's fair.
      </p>

      <h2>6. Acceptable use</h2>
      <p>
        Use Relish for ordering food, nothing else. Don't place fraudulent orders, abuse or threaten our
        couriers or restaurant staff, scrape the service, or try to break into parts of it that aren't yours.
        We may suspend an account that does any of these.
      </p>

      <h2>7. Restaurants and couriers</h2>
      <p>
        Restaurants on Relish are independent businesses and are responsible for their own food, its
        preparation, its description and their own food-safety obligations. Couriers deliver on our
        platform's behalf. We are responsible for the ordering service itself and for handling your order
        fairly when something goes wrong.
      </p>

      <h2>8. Allergies</h2>
      <p>
        Allergen and ingredient information comes from the restaurant. If you have a serious allergy, contact
        the restaurant directly before ordering - we can't guarantee any dish is free of a given allergen,
        and kitchens handle many ingredients in one space.
      </p>

      <h2>9. Liability</h2>
      <p>
        We do our best to keep the service running, but we can't promise it will always be available or
        error-free. Nothing here limits our liability for death or personal injury caused by negligence, for
        fraud, or for anything else that can't be limited by law. Otherwise our liability for a given order
        is limited to the value of that order.
      </p>

      <h2>10. Your data</h2>
      <p>
        We collect your email address, delivery addresses and order history so we can run the service, and we
        share the parts of an order a restaurant or courier needs to fulfil it. We don't sell your data. You
        can ask us for a copy of what we hold, or ask us to delete your account and the data with it.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms as the service changes. If a change materially affects you we'll tell you
        by email before it takes effect, and continuing to use Relish afterwards means you accept the updated
        terms.
      </p>
    </div>
  `,
  styles: `
    .terms {
      line-height: 1.6;
    }
    .updated {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.82rem;
      margin: 0 0 20px;
    }
    h2 {
      font-size: 1rem;
      margin: 22px 0 6px;
    }
    h2:first-of-type {
      margin-top: 0;
    }
    p {
      margin: 0;
      font-size: 0.9rem;
    }
  `,
})
export class TermsContent {}
