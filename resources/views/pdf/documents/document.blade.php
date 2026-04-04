<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        @page {
            size: A4;
            margin: 10mm 8mm 14mm 8mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            direction: rtl;
            text-align: right;
            background: #ffffff;
            color: #111;
            margin: 0;
            padding: 0;
            font-size: 13px;
        }

        .page {
            width: 100%;
            min-height: 100%;
            background: #ffffff;
        }

        .top {
            width: 100%;
            margin-bottom: 18px;
            overflow: hidden;
        }

        .company {
            float: right;
            width: 68%;
            line-height: 1.9;
        }

        .company-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .company-line {
            font-size: 15px;
            font-weight: 700;
        }

        .left-box {
            float: left;
            width: 24%;
            text-align: center;
        }

        .logo {
            max-width: 120px;
            max-height: 120px;
            margin-bottom: 10px;
        }

        .qr {
            width: 100px;
            height: 100px;
            margin-top: 8px;
        }

        .clearfix::after {
            content: "";
            display: block;
            clear: both;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table th,
        .info-table td,
        .items-table th,
        .items-table td,
        .totals-table td {
            border: 1px solid #555;
            padding: 8px 6px;
        }

        .info-table th,
        .items-table th {
            background: #c7ccd1;
            text-align: center;
            font-weight: bold;
        }

        .info-table td,
        .items-table td {
            background: #fff;
            text-align: center;
        }

        .items-table .desc {
            text-align: center;
            font-size: 17px;
            padding-top: 18px;
            padding-bottom: 18px;
        }

        .gap {
            height: 10px;
        }

        .totals-wrap {
            width: 42.1%;
            margin-left: auto;
            margin-top: -1px;
        }

        .totals-table .label {
            background: #c7ccd1;
            text-align: center;
            font-weight: bold;
            width: 65%;
        }

        .totals-table .value {
            background: #fff;
            text-align: center;
            width: 35%;
        }

        .totals-table .grand td {
            font-size: 17px;
            font-weight: bold;
        }

        .footer {
            position: fixed;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="page">
    <div class="top clearfix">
        <div class="company">
            <div class="company-name">{{ $company['name'] }}</div>
            <div class="company-line">الرقم الضريبي : {{ $company['vat_number'] ?? '-' }}</div>
            <div class="company-line">ايبان مصرف الأهلي : {{ $company['iban'] ?? '-' }}</div>
            <div class="company-line">س.ت : {{ $company['commercial_registration'] ?? '-' }}</div>
        </div>

        <div class="left-box">
            @if(!empty($company['logo']) && file_exists($company['logo']))
                <img class="logo" src="{{ $company['logo'] }}" alt="Logo">
            @endif

            @if($documentType === 'invoice' && !empty($qrCodeBase64))
                <img class="qr" src="data:image/svg+xml;base64,{{ $qrCodeBase64 }}" alt="QR">
            @endif
        </div>
    </div>

    <table class="info-table">
        <tr>
            <th style="width: 14%">رقم {{ $documentType === 'invoice' ? 'الفاتورة' : 'العرض' }}</th>
            <td style="width: 14%">{{ $number }}</td>

            <th style="width: 22%">{{ $title }}</th>

            <th style="width: 14%">اسم العميل</th>
            <td>{{ $customerName }}</td>
        </tr>
        <tr>
            <th>تاريخ {{ $documentType === 'invoice' ? 'الفاتورة' : 'العرض' }}</th>
            <td>{{ $date }}</td>

            <th>{{ $documentType === 'invoice' ? 'تاريخ التوريد' : 'تاريخ العرض' }}</th>

            <th>الرقم الضريبي للعميل</th>
            <td>{{ $customerVat ?: '-' }}</td>
        </tr>
    </table>

    <div class="gap"></div>

    <table class="items-table">
        <thead>
        <tr>
            <th style="width: 12%">الإجمالي</th>
            <th style="width: 12%">الإفرادي</th>
            <th style="width: 8%">الكمية</th>
            <th style="width: 10%">الوحدة</th>
            <th>الوصف</th>
            <th style="width: 6%">م</th>
        </tr>
        </thead>
        <tbody>
        @foreach($items as $index => $item)
            <tr>
                <td>{{ number_format((float) $item['total'], 2) }}</td>
                <td>{{ number_format((float) $item['unit_price'], 2) }}</td>
                <td>{{ $item['qty'] }}</td>
                <td>{{ $item['unit'] }}</td>
                <td class="desc">{{ $item['name'] }}</td>
                <td>{{ $index + 1 }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="totals-wrap">
        <table class="totals-table">
            <tr>
                <td class="value">{{ number_format((float) $subtotal, 2) }}</td>
                <td class="label">المجموع</td>
            </tr>
            <tr>
                <td class="value">{{ number_format((float) $taxAmount, 2) }}</td>
                <td class="label">ضريبة القيمة المضافة % 15</td>
            </tr>
            <tr class="grand">
                <td class="value">{{ number_format((float) $total, 2) }}</td>
                <td class="label">الإجمالي</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        {{ $company['name'] }}
    </div>
</div>
</body>
</html>