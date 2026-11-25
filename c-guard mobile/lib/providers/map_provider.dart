import 'package:c_guard/core/services/location_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';
import 'package:geolocator/geolocator.dart';
import 'package:routing_client_dart/routing_client_dart.dart' as routing;

class MapProvider with ChangeNotifier {
  final LocationService _locationService = LocationService();
  final routing.RoutingManager _routingManager = routing.RoutingManager();

  RoadInfo? _lastRoad;
  GeoPoint? _lastRoadDestination;
  bool _isMapReady = false;

  MapController controller = _createMapController();

  static MapController _createMapController() => MapController.customLayer(
    initMapWithUserPosition: const UserTrackingOption(
      enableTracking: true,
      unFollowUser: false,
    ),
    customTile: CustomTile.openFreeMap(),
  );

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  void prepareMapController() {
    if (_isMapReady) return;

    controller = _createMapController();
  }

  void setMapReady(bool isReady) {
    _isMapReady = isReady;
  }

  void closeMapControllers() {
    _isMapReady = false;
  }

  Future<GeoPoint?> _currentMapPosition() async {
    if (!_isMapReady) return null;

    try {
      return await controller.myLocation();
    } catch (e) {
      debugPrint('Could not get user location from map: $e');
      return null;
    }
  }

  Future<GeoPoint?> _startPosition() async {
    final mapPosition = await _currentMapPosition();
    if (mapPosition != null) return mapPosition;

    final position = await _locationService.getCurrentPosition();
    if (position == null) return null;

    return GeoPoint(latitude: position.latitude, longitude: position.longitude);
  }

  Future<double?> _routeDuration(GeoPoint start, GeoPoint destination) async {
    try {
      final route = await _routingManager.getRoute(
        request: routing.OSRMRequest.route(
          waypoints: [
            routing.LngLat(lng: start.longitude, lat: start.latitude),
            routing.LngLat(
              lng: destination.longitude,
              lat: destination.latitude,
            ),
          ],
          routingType: routing.RoutingType.car,
          geometries: routing.Geometries.geojson,
        ),
      );

      return route.duration > 0 ? route.duration : null;
    } catch (e) {
      debugPrint('Could not calculate route duration: $e');
      return null;
    }
  }

  Future<RoadInfo?> drawRoad(GeoPoint destination) async {
    final start = await _currentMapPosition();
    if (start == null) return null;

    final road = await controller.drawRoad(
      start,
      destination,
      roadType: RoadType.car,
      roadOption: const RoadOption(roadWidth: 10, roadColor: Colors.blue),
    );
    _lastRoad = road;
    _lastRoadDestination = destination;
    notifyListeners();
    return road;
  }

  Future<double?> calculateDistance(GeoPoint destination) async {
    final start = await _startPosition();
    if (start == null) return null;

    return Geolocator.distanceBetween(
      start.latitude,
      start.longitude,
      destination.latitude,
      destination.longitude,
    );
  }

  Future<Duration?> timeToReachDestination(GeoPoint destination) async {
    if (_lastRoadDestination == destination) {
      final roadSeconds = _lastRoad?.duration;
      if (roadSeconds != null) return Duration(seconds: roadSeconds.round());
    }

    final start = await _startPosition();
    if (start == null) return null;

    final seconds = await _routeDuration(start, destination);
    if (seconds == null) return null;

    return Duration(seconds: seconds.round());
  }
}
