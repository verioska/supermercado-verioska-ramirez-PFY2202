import { Minus, Plus } from 'lucide-react';

export default function QuantityControl({ value, onDecrease, onIncrease, minimum = 1, maximum, label }) {
  return <div className="quantity-control" role="group" aria-label={`Cantidad de ${label}`}>
    <button type="button" onClick={onDecrease} disabled={value <= minimum} aria-label={`Disminuir cantidad de ${label}`}><Minus size={16} /></button>
    <output aria-live="polite" aria-label={`Cantidad seleccionada de ${label}`}>{value}</output>
    <button type="button" onClick={onIncrease} disabled={value >= maximum} aria-label={`Aumentar cantidad de ${label}`}><Plus size={16} /></button>
  </div>;
}
