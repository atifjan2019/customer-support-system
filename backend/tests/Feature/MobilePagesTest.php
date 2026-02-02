<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MobilePagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_mobile_pages_render(): void
    {
        $this->get('/mobile')->assertOk();
        $this->get('/mobile/login')->assertOk();
    $this->get('/mobile/dashboard')->assertRedirect('/login');
        $this->get('/mobile/leads')->assertRedirect('/login');
        $this->get('/mobile/complaints')->assertRedirect('/login');
        $this->get('/mobile/settings')->assertRedirect('/login');
    }

    public function test_mobile_login_allows_access_to_dashboard(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/mobile/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect('/mobile/dashboard');
        $this->get('/mobile/dashboard')->assertOk();
        $this->get('/mobile/leads')->assertOk();
        $this->get('/mobile/complaints')->assertOk();
        $this->get('/mobile/settings')->assertOk();
    }

    public function test_mobile_lead_crud_flow(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $this->post('/mobile/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect('/mobile/dashboard');

        $createResponse = $this->post('/mobile/leads', [
            'customer_name' => 'Test Lead',
            'phone' => '555-1234',
            'address' => '123 Street',
            'lead_type' => 'new_connection',
            'status' => 'open',
            'priority' => 'normal',
        ]);

        $lead = Lead::first();
        $createResponse->assertRedirect('/mobile/leads/'.$lead->id);

        $this->put('/mobile/leads/'.$lead->id, [
            'customer_name' => 'Updated Lead',
            'phone' => '555-5678',
            'address' => '456 Avenue',
            'lead_type' => 'upgrade',
            'status' => 'pending',
            'priority' => 'high',
        ])->assertRedirect('/mobile/leads/'.$lead->id);

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'customer_name' => 'Updated Lead',
            'status' => 'pending',
        ]);

        $this->delete('/mobile/leads/'.$lead->id)->assertRedirect('/mobile/leads');
        $this->assertDatabaseMissing('leads', ['id' => $lead->id]);
    }

    public function test_mobile_complaint_flow(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);

        $this->post('/mobile/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $createResponse = $this->post('/mobile/complaints', [
            'customer_name' => 'Complaint User',
            'phone' => '555-9999',
            'address' => '789 Road',
            'priority' => 'high',
            'category' => 'Outage',
            'description' => 'Internet is down',
            'severity' => 'critical',
        ]);

        $lead = Lead::first();
        $createResponse->assertRedirect('/mobile/complaints/'.$lead->id);

        $this->post('/mobile/complaints/'.$lead->id.'/resolve', [
            'resolution_notes' => 'Rebooted modem',
        ])->assertRedirect('/mobile/complaints/'.$lead->id);

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'status' => 'resolved',
        ]);

        $this->assertDatabaseHas('complaints', [
            'lead_id' => $lead->id,
            'resolution_notes' => 'Rebooted modem',
        ]);

        $this->delete('/mobile/complaints/'.$lead->id)->assertRedirect('/mobile/complaints');
        $this->assertDatabaseMissing('leads', ['id' => $lead->id]);
        $this->assertDatabaseMissing('complaints', ['lead_id' => $lead->id]);
    }
}
