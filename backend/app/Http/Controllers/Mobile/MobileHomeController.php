<?php

namespace App\Http\Controllers\Mobile;

use App\Http\Controllers\Controller;

class MobileHomeController extends Controller
{
    public function index()
    {
        return view('mobile.home');
    }
}
