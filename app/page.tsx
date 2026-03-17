import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, AlertTriangle, Truck, Package, TrendingUp, Filter } from "lucide-react";

const demoRows = [
  {
    id: 1,
    articleNumber: "04001441",
    articleGroup: "Futterschale Silikon – KATZE",
    variant: "steinfarben",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    currentStock: 1156,
    inbound: 0,
    sales12m: 1572,
    salesMonthsObserved: 12,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    nextOrderDate: "2026-03-01",
    isActive: true,
    orderRoundTo: 100,
    fixedOrderDate: true,
  },
  {
    id: 2,
    articleNumber: "04001438",
    articleGroup: "Futterschale Silikon – KATZE",
    variant: "salbeigrün",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    currentStock: 736,
    inbound: 0,
    sales12m: 1155,
    salesMonthsObserved: 12,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    nextOrderDate: "2026-03-01",
    isActive: true,
    orderRoundTo: 100,
    fixedOrderDate: true,
  },
  {
    id: 3,
    articleNumber: "04001637",
    articleGroup: "Futterschale Silikon – KATZE",
    variant: "graphitgrau",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    currentStock: 73,
    inbound: 0,
    sales12m: 1146,
    salesMonthsObserved: 12,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    nextOrderDate: "2026-03-01",
    isActive: true,
    orderRoundTo: 100,
    fixedOrderDate: true,
  },
  {
    id: 4,
    articleNumber: "04001553",
    articleGroup: "Napfunterlage Silikon – KATZE",
    variant: "stone grey",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    currentStock: 307,
    inbound: 0,
    sales12m: 1001,
    salesMonthsObserved: 12,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    nextOrderDate: "2026-03-01",
    isActive: true,
    orderRoundTo: 100,
    fixedOrderDate: true,
  },
  {
    id: 5,
    articleNumber: "04001564",
    articleGroup: "Napfunterlage Silikon – KATZE",
    variant: "salbeigrün",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    currentStock: 0,
    inbound: 0,
    sales12m: 1344,
    salesMonthsObserved: 12,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    nextOrderDate: "2026-03-01",
    isActive: true,
    orderRoundTo: 100,
    fixedOrderDate: true,
  },
  {
    id: 6,
    articleNumber: "04001604",
    articleGroup: "Anti Schling Napf Silikon – KATZE",
    variant: "blaugrau",
    supplier: "Jeremy",
    brand: "ne&no",
    region: "EU",
    currentStock: 0,
    inbound: 0,
    sales12m: 0,
    salesMonthsObserved: 0,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 2,
    shippingMonths: 2,
    nextOrderDate: "2026-03-01",
    isActive: false,
    orderRoundTo: 100,
    fixedOrderDate: true,
  },
  {
    id: 7,
    articleNumber: "UK-LAMP-01",
    articleGroup: "Lampe UK",
    variant: "white plug UK",
    supplier: "Lamp Supplier",
    brand: "Other Brand",
    region: "UK",
    currentStock: 42,
    inbound: 0,
    sales12m: 96,
    salesMonthsObserved: 12,
    targetMonths: 12,
    safetyMonths: 2,
    productionMonths: 1,
    shippingMonths: 1,
    nextOrderDate: "2026-06-01",
    isActive: true,
    orderRoundTo: 24,
    fixedOrderDate: false,
  },
];

function monthsBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const days = end.getDate() - start.getDate();
  const total = years * 12 + months + days / 30;
  return Math.max(0, Number(total.toFixed(2)));
}

function roundUp(value, roundTo) {
  if (value <= 0) return 0;
  if (!roundTo || roundTo <= 1) return Math.ceil(value);
  return Math.ceil(value / roundTo) * roundTo;
}

function safeMonthlySales(row) {
  if (!row.salesMonthsObserved || row.salesMonthsObserved <= 0) return 0;
  return row.sales12m / row.salesMonthsObserved;
}

function computeRow(row, today) {
  const monthlySales = safeMonthlySales(row);
  const arrivalDate = new Date(row.nextOrderDate);
  arrivalDate.setMonth(arrivalDate.getMonth() + row.productionMonths + row.shippingMonths);

  const monthsToArrival = monthsBetween(today, arrivalDate.toISOString().slice(0, 10));
  const expectedConsumptionUntilArrival = monthlySales * monthsToArrival;
  const expectedStockAtArrival = Math.max(0, row.currentStock + row.inbound - expectedConsumptionUntilArrival);
  const targetMonthsAfterArrival = row.targetMonths + row.safetyMonths;
  const requiredFromArrival = monthlySales * targetMonthsAfterArrival;
  const rawOrderQty = Math.max(0, requiredFromArrival - expectedStockAtArrival);
  const roundedOrderQty = roundUp(rawOrderQty, row.orderRoundTo);
  const currentCoverageMonths = monthlySales > 0 ? (row.currentStock + row.inbound) / monthlySales : 999;

  let status = "OK";
  let statusTone = "bg-emerald-100 text-emerald-700 border-emerald-200";
  let statusReason = "Alles im grünen Bereich.";

  if (!row.isActive) {
    status = "Inaktiv";
    statusTone = "bg-slate-100 text-slate-700 border-slate-200";
    statusReason = "Artikel ist als nicht nachbestellen markiert.";
  } else if (row.fixedOrderDate) {
    if (currentCoverageMonths < monthsToArrival) {
      status = "Kritisch";
      statusTone = "bg-red-100 text-red-700 border-red-200";
      statusReason = `Bestand reicht voraussichtlich nicht bis Wareneingang in ${monthsToArrival.toFixed(1)} Monaten.`;
    } else if (currentCoverageMonths < monthsToArrival + 1) {
      status = "Knapp";
      statusTone = "bg-amber-100 text-amber-700 border-amber-200";
      statusReason = `Bestand reicht nur knapp bis Wareneingang.`;
    }
  } else {
    if (currentCoverageMonths < 1) {
      status = "Akut";
      statusTone = "bg-red-100 text-red-700 border-red-200";
      statusReason = "Reichweite unter 1 Monat.";
    } else if (currentCoverageMonths < row.productionMonths + row.shippingMonths) {
      status = "Kritisch";
      statusTone = "bg-red-100 text-red-700 border-red-200";
      statusReason = "Reichweite unter Lieferzeit.";
    } else if (currentCoverageMonths < 3) {
      status = "Achtung";
      statusTone = "bg-amber-100 text-amber-700 border-amber-200";
      statusReason = "Reichweite unter 3 Monaten.";
    }
  }

  return {
    ...row,
    monthlySales,
    arrivalDate: arrivalDate.toISOString().slice(0, 10),
    monthsToArrival,
    expectedStockAtArrival,
    requiredFromArrival,
    rawOrderQty,
    roundedOrderQty,
    currentCoverageMonths,
    status,
    statusTone,
    statusReason,
  };
}

export default function EinkaufsPlanungstoolMVP() {
  const [today, setToday] = useState("2026-01-01");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [needOnly, setNeedOnly] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const computed = useMemo(() => demoRows.map((row) => computeRow(row, today)), [today]);

  const filtered = useMemo(() => {
    return computed.filter((row) => {
      if (supplierFilter !== "all" && row.supplier !== supplierFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (needOnly && row.roundedOrderQty <= 0) return false;
      return true;
    });
  }, [computed, supplierFilter, statusFilter, needOnly]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = `${row.articleGroup}__${row.supplier}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          articleGroup: row.articleGroup,
          supplier: row.supplier,
          brand: row.brand,
          region: row.region,
          rows: [],
          totalStock: 0,
          totalOrder: 0,
          weightedCoverageBase: 0,
          weightedCoverageDemand: 0,
          criticalCount: 0,
        });
      }
      const entry = map.get(key);
      entry.rows.push(row);
      entry.totalStock += row.currentStock + row.inbound;
      entry.totalOrder += row.roundedOrderQty;
      entry.weightedCoverageBase += row.currentStock + row.inbound;
      entry.weightedCoverageDemand += row.monthlySales;
      if (["Akut", "Kritisch", "Knapp", "Achtung"].includes(row.status)) entry.criticalCount += 1;
    });

    return Array.from(map.values()).map((group) => {
      const coverage = group.weightedCoverageDemand > 0 ? group.weightedCoverageBase / group.weightedCoverageDemand : 999;
      let groupStatus = "OK";
      let groupTone = "bg-emerald-100 text-emerald-700 border-emerald-200";
      if (group.rows.some((r) => r.status === "Akut")) {
        groupStatus = "Akut";
        groupTone = "bg-red-100 text-red-700 border-red-200";
      } else if (group.rows.some((r) => r.status === "Kritisch")) {
        groupStatus = "Kritisch";
        groupTone = "bg-red-100 text-red-700 border-red-200";
      } else if (group.rows.some((r) => r.status === "Knapp" || r.status === "Achtung")) {
        groupStatus = "Achtung";
        groupTone = "bg-amber-100 text-amber-700 border-amber-200";
      } else if (group.rows.every((r) => r.status === "Inaktiv")) {
        groupStatus = "Inaktiv";
        groupTone = "bg-slate-100 text-slate-700 border-slate-200";
      }
      return {
        ...group,
        coverage,
        groupStatus,
        groupTone,
      };
    });
  }, [filtered]);

  const supplierSummary = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      if (!map.has(row.supplier)) map.set(row.supplier, { supplier: row.supplier, qty: 0, lines: 0 });
      const entry = map.get(row.supplier);
      entry.qty += row.roundedOrderQty;
      entry.lines += row.roundedOrderQty > 0 ? 1 : 0;
    });
    return Array.from(map.values());
  }, [filtered]);

  const criticalItems = filtered.filter((r) => ["Akut", "Kritisch", "Knapp", "Achtung"].includes(r.status));

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Einkaufs-Planungstool MVP</h1>
            <p className="text-sm text-slate-600 mt-1">
              Erste Web-App-Version für Bestellplanung ab Wareneingang, fixe Bestelltermine, Warnungen und Lieferantenübersicht.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border">
            <Label htmlFor="today">Stichtag</Label>
            <Input id="today" type="date" value={today} onChange={(e) => setToday(e.target.value)} className="w-[180px]" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Artikelgruppen</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-semibold">{grouped.length}</div></CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Kritische Warnungen</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-semibold">{criticalItems.length}</div></CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Bestellmenge gesamt</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-semibold">{filtered.reduce((sum, r) => sum + r.roundedOrderQty, 0)}</div></CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Lieferanten aktiv</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-semibold">{new Set(filtered.map((r) => r.supplier)).size}</div></CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter className="h-4 w-4" /> Filter</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Lieferant</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {Array.from(new Set(computed.map((r) => r.supplier))).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {Array.from(new Set(computed.map((r) => r.status))).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nur mit Bedarf</Label>
              <div className="flex h-10 items-center gap-3 rounded-md border px-3 bg-white">
                <input type="checkbox" checked={needOnly} onChange={(e) => setNeedOnly(e.target.checked)} />
                <span className="text-sm text-slate-700">Bestellmenge &gt; 0</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Datei-Upload</Label>
              <Button variant="outline" className="w-full justify-start gap-2" disabled>
                <Upload className="h-4 w-4" /> CSV / Excel Upload kommt in Phase 2
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="supplier">Lieferanten</TabsTrigger>
            <TabsTrigger value="alerts">Warnungen</TabsTrigger>
            <TabsTrigger value="logic">Logik-Check</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Artikelübersicht mit Parent-Struktur</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artikel / Parent</TableHead>
                      <TableHead>Lieferant</TableHead>
                      <TableHead className="text-right">Gesamtbestand</TableHead>
                      <TableHead className="text-right">Reichweite</TableHead>
                      <TableHead className="text-right">Bestellung</TableHead>
                      <TableHead className="text-right">Warnungen</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grouped.map((group) => (
                      <React.Fragment key={group.key}>
                        <TableRow className="bg-slate-100/80">
                          <TableCell>
                            <button onClick={() => toggleGroup(group.key)} className="flex items-center gap-2 text-left font-semibold hover:opacity-80">
                              <span className="inline-block w-4">{expandedGroups[group.key] ? "▾" : "▸"}</span>
                              <span>{group.articleGroup}</span>
                            </button>
                          </TableCell>
                          <TableCell>{group.supplier}</TableCell>
                          <TableCell className="text-right font-medium">{group.totalStock}</TableCell>
                          <TableCell className="text-right">{group.coverage.toFixed(1)} M</TableCell>
                          <TableCell className="text-right font-semibold">{group.totalOrder}</TableCell>
                          <TableCell className="text-right">{group.criticalCount}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={group.groupTone}>{group.groupStatus}</Badge>
                          </TableCell>
                        </TableRow>
                        {expandedGroups[group.key] && group.rows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="pl-10">
                              <div className="font-medium">{row.variant}</div>
                              <div className="text-xs text-slate-500">{row.articleNumber}</div>
                            </TableCell>
                            <TableCell>{row.supplier}</TableCell>
                            <TableCell className="text-right">{row.currentStock + row.inbound}</TableCell>
                            <TableCell className="text-right">{row.currentCoverageMonths.toFixed(1)} M</TableCell>
                            <TableCell className="text-right font-semibold">{row.roundedOrderQty}</TableCell>
                            <TableCell className="text-right">{["Akut", "Kritisch", "Knapp", "Achtung"].includes(row.status) ? "1" : "0"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={row.statusTone}>{row.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplier">
            <div className="grid gap-4 lg:grid-cols-[1.1fr,1.9fr]">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Truck className="h-4 w-4" /> Lieferanten-Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supplierSummary.map((s) => (
                    <div key={s.supplier} className="rounded-xl border bg-white p-4">
                      <div className="font-medium">{s.supplier}</div>
                      <div className="text-sm text-slate-600 mt-1">Bestellmenge: {s.qty}</div>
                      <div className="text-sm text-slate-600">Positionen: {s.lines}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" /> Bestellvorschläge</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lieferant</TableHead>
                        <TableHead>Artikel</TableHead>
                        <TableHead>Variante</TableHead>
                        <TableHead className="text-right">Rohbedarf</TableHead>
                        <TableHead className="text-right">Gerundet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.filter((r) => r.roundedOrderQty > 0).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.supplier}</TableCell>
                          <TableCell>{row.articleGroup}</TableCell>
                          <TableCell>{row.variant}</TableCell>
                          <TableCell className="text-right">{Math.round(row.rawOrderQty)}</TableCell>
                          <TableCell className="text-right font-semibold">{row.roundedOrderQty}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-4">
              {criticalItems.length === 0 ? (
                <Alert className="rounded-2xl">
                  <TrendingUp className="h-4 w-4" />
                  <AlertTitle>Keine kritischen Warnungen</AlertTitle>
                  <AlertDescription>Zum gewählten Stichtag gibt es aktuell keine Artikel mit dringendem Handlungsbedarf.</AlertDescription>
                </Alert>
              ) : (
                criticalItems.map((row) => (
                  <Alert key={row.id} className="rounded-2xl border-l-4 border-l-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{row.articleGroup} – {row.variant}</AlertTitle>
                    <AlertDescription>
                      <div className="mt-1 text-sm text-slate-700">{row.statusReason}</div>
                      <div className="mt-2 grid gap-2 md:grid-cols-4 text-sm">
                        <div>Reichweite jetzt: <strong>{row.currentCoverageMonths.toFixed(1)} M</strong></div>
                        <div>Wareneingang: <strong>{row.arrivalDate}</strong></div>
                        <div>Bestellung: <strong>{row.roundedOrderQty}</strong></div>
                        <div>Lieferant: <strong>{row.supplier}</strong></div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="logic">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Bestelllogik ab Wareneingang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <div className="rounded-xl bg-slate-50 p-4 border">
                  <div className="font-medium mb-2">Fixierte Kernregel</div>
                  <div>
                    Bestellmenge = Bedarf für Zielzeitraum <strong>ab Wareneingang</strong> minus erwarteter Bestand bei Wareneingang.
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artikel</TableHead>
                      <TableHead className="text-right">Monat</TableHead>
                      <TableHead className="text-right">Monate bis Wareneingang</TableHead>
                      <TableHead className="text-right">Bestand bei Wareneingang</TableHead>
                      <TableHead className="text-right">Bedarf ab Wareneingang</TableHead>
                      <TableHead className="text-right">Bestellung</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.articleGroup} / {row.variant}</TableCell>
                        <TableCell className="text-right">{row.monthlySales.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{row.monthsToArrival.toFixed(1)}</TableCell>
                        <TableCell className="text-right">{Math.round(row.expectedStockAtArrival)}</TableCell>
                        <TableCell className="text-right">{Math.round(row.requiredFromArrival)}</TableCell>
                        <TableCell className="text-right font-semibold">{row.roundedOrderQty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
