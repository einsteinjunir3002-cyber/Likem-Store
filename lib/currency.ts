/**
 * Format monetary amount in Ghana Cedis (GHS / GH₵)
 * Uses exact decimal representation to avoid JS float precision pitfalls.
 */
export function formatGhs(amount: number | string | { toString(): string } | null | undefined): string {
  if (amount === null || amount === undefined) {
    return 'GH₵0.00';
  }

  const numericValue = typeof amount === 'number' ? amount : parseFloat(amount.toString());

  if (isNaN(numericValue)) {
    return 'GH₵0.00';
  }

  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(numericValue)
    .replace('GHS', 'GH₵');
}

/**
 * Normalizes Ghanaian phone numbers into standard WhatsApp international format (e.g. 233502547133)
 */
export function normalizeGhanaPhone(phone: string): string {
  if (!phone) return '233502547133';
  const cleaned = phone.replace(/[^0-9]/g, '');

  // 0502547133 -> 233502547133
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `233${cleaned.slice(1)}`;
  }

  // +233... or 233...
  if (cleaned.startsWith('233')) {
    return cleaned;
  }

  return cleaned;
}

/**
 * Generates dynamic WhatsApp click-to-chat order link
 */
export function generateWhatsAppOrderUrl(options: {
  phone: string;
  productName: string;
  priceInGhs: number | string;
  quantity?: number;
  variantSize?: string;
  template?: string;
  customerRegion?: string;
}): string {
  const normalizedPhone = normalizeGhanaPhone(options.phone);
  const formattedPrice = formatGhs(options.priceInGhs);
  const qty = options.quantity || 1;
  const sizeText = options.variantSize ? ` (${options.variantSize})` : '';
  const regionText = options.customerRegion ? ` to ${options.customerRegion}` : '';

  let message = `Hello! I would like to order ${options.productName}${sizeText}.\nPrice: ${formattedPrice}\nQuantity: ${qty}\nPlease confirm availability and delivery${regionText}.`;

  if (options.template) {
    message = options.template
      .replace('{product_name}', `${options.productName}${sizeText}`)
      .replace('{price}', formattedPrice)
      .replace('{quantity}', String(qty))
      .replace('{region}', options.customerRegion || 'my location');
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates dynamic WhatsApp Cart order message
 */
export function generateWhatsAppCartUrl(options: {
  phone: string;
  items: Array<{ name: string; size?: string; price: number; quantity: number }>;
  deliveryRegion?: string;
  deliveryFee?: number;
  total: number;
}): string {
  const normalizedPhone = normalizeGhanaPhone(options.phone);

  let message = `Hello! I would like to place an order from your website:\n\n`;
  options.items.forEach((item, idx) => {
    message += `${idx + 1}. ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} - ${formatGhs(item.price * item.quantity)}\n`;
  });

  if (options.deliveryRegion) {
    message += `\nDelivery Region: ${options.deliveryRegion}`;
  }
  if (options.deliveryFee) {
    message += `\nDelivery Fee: ${formatGhs(options.deliveryFee)}`;
  }
  message += `\nEstimated Total: ${formatGhs(options.total)}`;
  message += `\n\nPlease confirm availability and payment/delivery arrangement.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
