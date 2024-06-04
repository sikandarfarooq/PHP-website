<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Game</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('css/style.css') }}">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            text-align: center;
            padding: 50px;
        }

        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px 0;
        }

        .header h1 {
            margin: 0;
        }

        .content {
            margin: 20px 0;
        }

        .btn {
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            font-size: 18px;
            border-radius: 5px;
        }

        .btn:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to Our Computer Vision Game</h1>
    </div>

    <div class="container">
        <div class="content">
            <p>Experience an amazing game using the power of computer vision. Click the button below to start playing!</p>
        </div>
        <a href="{{ route('game') }}" class="btn">Play the Game</a>
    </div>
</body>
</html>

