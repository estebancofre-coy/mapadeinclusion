import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  agregarOrganizacion, eliminarOrganizacion, leerLog, registrarLog,
  USUARIOS_DEMO, validarOrganizacion, COMUNAS, TIPOS,
  type Organizacion, type UsuarioDemo,
} from '@/data/organizaciones';
import { CheckCircle2, LogOut, Trash2 } from 'lucide-react';

interface Props {
  abierto: boolean;
  onCerrar: () => void;
  organizaciones: Organizacion[];
  onCambio: (orgs: Organizacion[]) => void;
}

export function PanelOperador({ abierto, onCerrar, organizaciones, onCambio }: Props) {
  const [usuario, setUsuario] = useState<UsuarioDemo | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Formulario nueva ficha
  const [form, setForm] = useState({ nombre: '', comuna: '', tipo: '', direccion: '', telefono: '', email: '', horario: '', descripcion: '', accesibilidad: '', lat: '-45.5712', lng: '-72.0685' });
  const [mensaje, setMensaje] = useState('');

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const u = USUARIOS_DEMO.find(x => x.email === email.trim().toLowerCase() && x.password === password);
    if (u) {
      setUsuario(u); setError('');
      registrarLog(u.nombre, 'Inicio de sesión');
    } else {
      setError('Credenciales incorrectas. Prueba con las cuentas demo listadas abajo.');
    }
  };

  const salir = () => {
    if (usuario) registrarLog(usuario.nombre, 'Cierre de sesión');
    setUsuario(null); setEmail(''); setPassword('');
  };

  const validar = (id: number) => {
    onCambio(validarOrganizacion(id));
    registrarLog(usuario?.nombre || '?', `Validó la ficha #${id}`);
  };

  const eliminar = (id: number) => {
    if (!confirm('¿Eliminar esta ficha definitivamente?')) return;
    onCambio(eliminarOrganizacion(id));
    registrarLog(usuario?.nombre || '?', `Eliminó la ficha #${id}`);
  };

  const subirFicha = (e: React.FormEvent) => {
    e.preventDefault();
    onCambio(agregarOrganizacion({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) }));
    registrarLog(usuario?.nombre || '?', `Subió nueva ficha: ${form.nombre}`);
    setMensaje('Ficha enviada. Queda "En revisión" hasta que el equipo docente la valide.');
    setForm({ nombre: '', comuna: '', tipo: '', direccion: '', telefono: '', email: '', horario: '', descripcion: '', accesibilidad: '', lat: '-45.5712', lng: '-72.0685' });
  };

  const pendientes = organizaciones.filter(o => o.estado === 'pendiente');
  const activas = organizaciones.filter(o => o.estado === 'activa');
  const puedeValidar = usuario?.rol === 'admin' || usuario?.rol === 'operador';

  return (
    <Dialog open={abierto} onOpenChange={(v) => { if (!v) onCerrar(); }}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {!usuario ? (
          <>
            <DialogHeader>
              <DialogTitle>Panel de gestión — Acceso</DialogTitle>
              <DialogDescription>Versión de demostración con datos locales. Usa una cuenta demo para explorar los flujos.</DialogDescription>
            </DialogHeader>
            <form onSubmit={login} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="text-sm font-medium">Correo institucional</label>
                <Input id="login-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nombre@uaysen.cl" autoComplete="username" />
              </div>
              <div>
                <label htmlFor="login-pass" className="text-sm font-medium">Contraseña</label>
                <Input id="login-pass" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Ingresar</Button>
            </form>
            <Card className="mt-4 bg-muted/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Cuentas de demostración (contraseña: password123)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1">
                {USUARIOS_DEMO.map(u => (
                  <p key={u.email}><Badge variant="outline" className="mr-2">{u.rol}</Badge><code>{u.email}</code></p>
                ))}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Panel — {usuario.nombre} <Badge className="ml-2">{usuario.rol}</Badge></span>
              </DialogTitle>
              <DialogDescription>Sesión de demostración. Los cambios se guardan solo en este navegador.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-3 my-2" aria-label="Estadísticas">
              <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold text-primary">{organizaciones.length}</p><p className="text-xs text-muted-foreground">Fichas totales</p></CardContent></Card>
              <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold text-secondary">{activas.length}</p><p className="text-xs text-muted-foreground">Validadas</p></CardContent></Card>
              <Card><CardContent className="pt-4 text-center"><p className="text-3xl font-bold text-destructive">{pendientes.length}</p><p className="text-xs text-muted-foreground">Pendientes</p></CardContent></Card>
            </div>

            <Tabs defaultValue="pendientes">
              <TabsList className="w-full">
                <TabsTrigger value="pendientes" className="flex-1">Fichas pendientes ({pendientes.length})</TabsTrigger>
                <TabsTrigger value="nueva" className="flex-1">Subir ficha</TabsTrigger>
                <TabsTrigger value="log" className="flex-1">Registro</TabsTrigger>
              </TabsList>

              <TabsContent value="pendientes" className="space-y-3 mt-4">
                {pendientes.length === 0 && <p className="text-sm text-muted-foreground">No hay fichas pendientes de validación.</p>}
                {pendientes.map(o => (
                  <Card key={o.id}>
                    <CardContent className="pt-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{o.nombre}</p>
                        <p className="text-sm text-muted-foreground">{o.comuna} · {o.tipo} · {o.email}</p>
                      </div>
                      {puedeValidar && (
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="secondary" onClick={() => validar(o.id)}><CheckCircle2 className="h-4 w-4 mr-1" /> Validar</Button>
                          <Button size="sm" variant="destructive" onClick={() => eliminar(o.id)} aria-label={`Eliminar ficha ${o.nombre}`}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {!puedeValidar && <p className="text-sm text-muted-foreground">El rol estudiante puede subir fichas, pero no validarlas.</p>}
              </TabsContent>

              <TabsContent value="nueva">
                <form onSubmit={subirFicha} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="sm:col-span-2"><label className="text-sm font-medium" htmlFor="nf-nombre">Nombre de la organización *</label>
                    <Input id="nf-nombre" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-comuna">Comuna *</label>
                    <Select required value={form.comuna} onValueChange={v => setForm({ ...form, comuna: v })}>
                      <SelectTrigger id="nf-comuna"><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                      <SelectContent>{COMUNAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-tipo">Tipo *</label>
                    <Select required value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
                      <SelectTrigger id="nf-tipo"><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                      <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-dir">Dirección *</label>
                    <Input id="nf-dir" required value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} /></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-tel">Teléfono</label>
                    <Input id="nf-tel" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} /></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-mail">Correo</label>
                    <Input id="nf-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-hor">Horario</label>
                    <Input id="nf-hor" value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} /></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-lat">Latitud *</label>
                    <Input id="nf-lat" required type="number" step="any" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} /></div>
                  <div><label className="text-sm font-medium" htmlFor="nf-lng">Longitud *</label>
                    <Input id="nf-lng" required type="number" step="any" value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="text-sm font-medium" htmlFor="nf-desc">Descripción *</label>
                    <Textarea id="nf-desc" required rows={3} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="text-sm font-medium" htmlFor="nf-acc">Accesibilidad de la sede</label>
                    <Textarea id="nf-acc" rows={2} value={form.accesibilidad} onChange={e => setForm({ ...form, accesibilidad: e.target.value })} /></div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <Button type="submit">Enviar ficha a validación</Button>
                    {mensaje && <p role="status" className="text-sm text-secondary">{mensaje}</p>}
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="log" className="mt-4">
                <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
                  {leerLog().map((l, i) => (
                    <li key={i} className="border-b pb-1"><span className="text-muted-foreground">{l.fecha}</span> — <strong>{l.usuario}</strong>: {l.accion}</li>
                  ))}
                  {leerLog().length === 0 && <li className="text-muted-foreground">Sin actividad registrada aún.</li>}
                </ul>
              </TabsContent>
            </Tabs>

            <Button variant="outline" onClick={salir} className="mt-4"><LogOut className="h-4 w-4 mr-2" /> Cerrar sesión</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
