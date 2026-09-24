@echo off
echo Creating React Frontend Structure...

:: Assets
mkdir src\assets\images
mkdir src\assets\icons
mkdir src\assets\styles

:: Components
mkdir src\components
mkdir src\components\Navbar
mkdir src\components\Sidebar
mkdir src\components\Footer
mkdir src\components\DiseaseCard
mkdir src\components\PestCard
mkdir src\components\WeatherCard
mkdir src\components\MapView
mkdir src\components\UploadForm
mkdir src\components\Common

:: Pages
mkdir src\pages
mkdir src\pages\Home
mkdir src\pages\Login
mkdir src\pages\Register
mkdir src\pages\Dashboard
mkdir src\pages\DiseaseDetection
mkdir src\pages\PestDetection
mkdir src\pages\WeatherForecast
mkdir src\pages\HotspotMap
mkdir src\pages\ExpertReview
mkdir src\pages\Profile
mkdir src\pages\NotFound

:: Services
mkdir src\services

:: Context
mkdir src\context

:: Routes
mkdir src\routes

:: Hooks
mkdir src\hooks

:: Utils
mkdir src\utils

:: Layouts
mkdir src\layouts

:: Create common files
type nul > src\services\api.js

type nul > src\context\AuthContext.jsx

type nul > src\routes\AppRoutes.jsx

type nul > src\utils\constants.js
type nul > src\utils\helpers.js

type nul > src\layouts\MainLayout.jsx

echo Frontend Structure Created Successfully!
pause