import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/providers/map_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class MapViewWidget extends StatefulWidget {
  const MapViewWidget({super.key, required this.destination});

  final GeoPoint destination;

  @override
  State<MapViewWidget> createState() => _MapViewWidgetState();
}

class _MapViewWidgetState extends State<MapViewWidget> {
  bool showFullScreen = false;

  void onSshowFullScreen() {
    setState(() {
      showFullScreen = !showFullScreen;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      child: InkWell(
        onTap: () {
          onSshowFullScreen();
        },
        child: SizedBox(
          height: 223,
          width: MediaQuery.of(context).size.width,
          child: Stack(
            children: [
              AnimatedContainer(
                duration: Durations.extralong1,
                height: 223,
                curve: Curves.easeInBack,
                width: MediaQuery.of(context).size.width,
                foregroundDecoration: showFullScreen
                    ? BoxDecoration(
                        color: ColorManager.border.withValues(alpha: .7),
                      )
                    : null,
                color: ColorManager.blueFill,
                child: Center(
                  child: Text(
                    "Map View",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ),
              ),
              Align(
                alignment: AlignmentGeometry.center,
                child: AnimatedOpacity(
                  duration: Durations.extralong1,
                  opacity: showFullScreen ? 1 : 0,
                  child: IconButton(
                    onPressed: () {
                      context.pushNamed(
                        RouteConstants.mapView,
                        extra: widget.destination,
                      );
                    },
                    icon: Icon(Icons.fullscreen_outlined),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class FullMapView extends StatefulWidget {
  const FullMapView({super.key, required this.destination});

  final GeoPoint destination;

  @override
  State<FullMapView> createState() => _FullMapViewState();
}

class _FullMapViewState extends State<FullMapView> {
  Future<RoadInfo?>? _roadFuture;
  bool _roadRequested = false;
  MapProvider? _mapProvider;

  @override
  void initState() {
    super.initState();
    context.read<MapProvider>().prepareMapController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _mapProvider ??= context.read<MapProvider>();
  }

  void _onMapIsReady(bool isReady) {
    final provider = _mapProvider;
    if (provider == null || !mounted) return;

    provider.setMapReady(isReady);
    if (!isReady || _roadRequested) return;

    _roadRequested = true;
    setState(() {
      _roadFuture = provider.drawRoad(widget.destination);
    });
  }

  @override
  void dispose() {
    _mapProvider?.closeMapControllers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: "Map-view",
      child: Scaffold(
        body: Stack(
          children: [
            Consumer<MapProvider>(
              builder: (context, state, _) {
                return OSMFlutter(
                  controller: state.controller,
                  onMapIsReady: _onMapIsReady,
                  osmOption: OSMOption(
                    zoomOption: const ZoomOption(
                      minZoomLevel: 3,
                      maxZoomLevel: 19,
                      initZoom: 13,
                      stepZoom: 1.0,
                    ),
                    showZoomController: true,
                    showContributorBadgeForOSM: true,
                    staticPoints: [
                      StaticPositionGeoPoint(
                        'destination',
                        const MarkerIcon(
                          icon: Icon(
                            Icons.location_pin,
                            color: Colors.red,
                            size: 48,
                          ),
                        ),
                        [widget.destination],
                      ),
                    ],
                    userTrackingOption: const UserTrackingOption(
                      enableTracking: true,
                      unFollowUser: false,
                    ),
                    roadConfiguration: const RoadOption(
                      roadColor: Colors.yellowAccent,
                      roadWidth: 8,
                    ),
                    userLocationMarker: UserLocationMaker(
                      personMarker: const MarkerIcon(
                        icon: Icon(Icons.person, color: Colors.blue, size: 48),
                      ),
                      directionArrowMarker: const MarkerIcon(
                        icon: Icon(Icons.double_arrow, size: 48),
                      ),
                    ),
                  ),
                );
              },
            ),
            FutureBuilder<RoadInfo?>(
              future: _roadFuture,
              builder: (context, snapshot) {
                final message = snapshot.hasError
                    ? 'Could not draw route: ${snapshot.error}'
                    : snapshot.connectionState == ConnectionState.done &&
                          snapshot.data == null
                    ? 'Current location is unavailable; route could not be drawn.'
                    : null;
                if (message == null) return const SizedBox.shrink();

                return Positioned(
                  top: MediaQuery.paddingOf(context).top + 16,
                  left: 16,
                  right: 16,
                  child: Material(
                    color: Colors.white,
                    elevation: 4,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Text(message),
                    ),
                  ),
                );
              },
            ),
            const Positioned(
              bottom: 0,
              left: 5,
              child: Material(
                color: Colors.white70,
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 4, vertical: 3),
                  child: Text('© OpenFreeMap', style: TextStyle(fontSize: 9)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
