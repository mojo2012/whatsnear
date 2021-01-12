package io.spotnext.whatsnear.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.grum.geocalc.Coordinate;
import com.grum.geocalc.EarthCalc;
import com.grum.geocalc.Point;

import io.spotnext.core.infrastructure.service.impl.AbstractService;
import io.spotnext.whatsnear.beans.DistanceData;
import io.spotnext.whatsnear.beans.GeoLocationData;
import io.spotnext.whatsnear.beans.PointOfInterestData;
import io.spotnext.whatsnear.beans.PointOfInterestQueryData;
import io.spotnext.whatsnear.itemtypes.PointOfInterest;
import io.spotnext.whatsnear.itemtypes.enumeration.DistanceUnit;
import io.spotnext.whatsnear.services.PointOfInterestService;

@Service
public class DefaultPointOfInterestService extends AbstractService implements PointOfInterestService {

	@Override
	public List<PointOfInterestData> findAll() {
		
		var listings = modelService.getAll(PointOfInterest.class, null);
		
		return listings.stream().map(l -> convert(l)).collect(Collectors.toList());
	}
	
	@Override
	public List<PointOfInterestData> findAllNear(PointOfInterestQueryData query) {
		var location = query.getLocation();
		List<PointOfInterestData> ret = null;
		
		if (StringUtils.isNotBlank(location)) {
			var position = StringUtils.split(location, ",");
			var latitude = Double.parseDouble(position[0]);
			var longitude = Double.parseDouble(position[1]);
			ret = findAllNear(latitude, longitude);
		} else {
			ret = findAll();
		}
		
		return ret;
	}

	@Override
	public List<PointOfInterestData> findAllNear(double latitude, double longitude) {
		
		var searchPoint = getPoint(latitude, longitude);
		
		var pois = findAll();
		addDistance(pois, searchPoint);
		
		var ret = pois.stream().sorted((a, b) -> {
			if (a.getDistance() == b.getDistance()) {
				return 0;
			} else if (a.getDistance().getValue() < b.getDistance().getValue()) {
				return -1;
			} else {
				return 1;
			}
		}).collect(Collectors.toList());
		
		return ret;
	}
	
	private void addDistance(List<PointOfInterestData> pois, Point searchPoint) {
		if (CollectionUtils.isNotEmpty(pois)) {
			for (var poi : pois) {
				poi.setDistance(getDistance(searchPoint, getPoint(poi)));
			}
		}
	}
	
	private PointOfInterestData convert(PointOfInterest source) {
		var data = new PointOfInterestData();
		
		data.setUid(source.getUid());
		data.setTitle(source.getTitle());
		data.setDescription(source.getDescription());
		data.setType(source.getType());
		data.setAuthor(source.getAuthor());
		
		var location = new GeoLocationData();
		location.setLatitude(source.getLatitude());
		location.setLongitude(source.getLongitude());
		data.setLocation(location);
		
		return data;
	}
	
	private DistanceData getDistance(Point p1, Point p2) {
		var distance = new DistanceData();
		distance.setValue(EarthCalc.gcd.distance(p1, p2));
		distance.setUnit(DistanceUnit.Meters);
		return distance;
	}
	
	private Point getPoint(double latitude, double longitude) {
		Coordinate lat = Coordinate.fromDegrees(latitude);
		Coordinate lng = Coordinate.fromDegrees(longitude);
		
		return Point.at(lat, lng);
	}
	
	private Point getPoint(PointOfInterestData data) {
		return getPoint(data.getLocation().getLatitude(), data.getLocation().getLongitude());
	}

}
