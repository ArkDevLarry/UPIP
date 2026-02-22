<?php

namespace App\Services\Consent;

use App\Enums\ConsentModule;
use App\Models\ConsentRecord;
use Illuminate\Support\Collection;
use Illuminate\Auth\Access\AuthorizationException;

class ConsentService
{
    /**
     * Grant consent for one or more modules.
     */
    public function grant(int $userId, array $modules, string $ipAddress, ?string $userAgent): Collection
    {
        $records = collect();

        foreach ($modules as $module) {
            $enum = ConsentModule::from($module);

            // Revoke any existing record first
            ConsentRecord::where('user_id', $userId)
                ->where('module', $enum->value)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);

            $record = ConsentRecord::create([
                'user_id'    => $userId,
                'module'     => $enum->value,
                'granted'    => true,
                'granted_at' => now(),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            $records->push($record);
        }

        return $records;
    }

    /**
     * Revoke consent for a module. Stops all processing immediately.
     */
    public function revoke(int $userId, ConsentModule $module, string $ipAddress): void
    {
        ConsentRecord::where('user_id', $userId)
            ->where('module', $module->value)
            ->whereNull('revoked_at')
            ->update([
                'granted'    => false,
                'revoked_at' => now(),
                'ip_address' => $ipAddress,
            ]);
    }

    /**
     * Check if a user has active consent for a module.
     */
    public function hasConsent(int $userId, string $module): bool
    {
        return ConsentRecord::where('user_id', $userId)
            ->where('module', $module)
            ->active()
            ->exists();
    }

    /**
     * Throw if consent is missing. Used as gate in ingestion services.
     */
    public function requireConsent(int $userId, string $module): void
    {
        if (!$this->hasConsent($userId, $module)) {
            throw new AuthorizationException(
                "Consent for module '{$module}' is required. Please grant consent at POST /consent."
            );
        }
    }

    /**
     * Get all active consent modules for a user.
     */
    public function getActiveModules(int $userId): array
    {
        return ConsentRecord::where('user_id', $userId)
            ->active()
            ->pluck('module')
            ->toArray();
    }

    /**
     * Get full consent history for a user.
     */
    public function getUserConsents(int $userId): Collection
    {
        return ConsentRecord::where('user_id', $userId)
            ->latest('granted_at')
            ->get();
    }
}
