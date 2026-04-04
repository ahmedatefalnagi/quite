<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCompanySettingRequest;
use App\Models\CompanySetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanySettingController extends Controller
{
    public function edit(): Response
    {
        $settings = CompanySetting::first();

        return Inertia::render('Settings/Company', [
            'settings' => $settings,
        ]);
    }

    public function update(UpdateCompanySettingRequest $request): RedirectResponse
    {
        $settings = CompanySetting::first();

        if (!$settings) {
            CompanySetting::create($request->validated());
        } else {
            $settings->update($request->validated());
        }

        return redirect()
            ->back()
            ->with('success', 'تم حفظ إعدادات الشركة بنجاح');
    }
}