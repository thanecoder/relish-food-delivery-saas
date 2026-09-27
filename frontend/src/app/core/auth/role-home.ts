export const ROLE_HOME: Record<string, string> = {
  CUSTOMER: '/customer',
  RESTAURANT_ADMIN: '/restaurant-admin',
  DELIVERY_PARTNER: '/delivery',
  PLATFORM_ADMIN: '/admin',
};

export function homeFor(role: string | undefined): string {
  return (role && ROLE_HOME[role]) || '/customer';
}
