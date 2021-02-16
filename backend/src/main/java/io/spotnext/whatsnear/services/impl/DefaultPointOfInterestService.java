package io.spotnext.whatsnear.services.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.grum.geocalc.Coordinate;
import com.grum.geocalc.EarthCalc;
import com.grum.geocalc.Point;

import io.spotnext.core.infrastructure.service.UserService;
import io.spotnext.core.infrastructure.service.impl.AbstractService;
import io.spotnext.itemtype.core.user.User;
import io.spotnext.itemtype.core.user.UserGroup;
import io.spotnext.whatsnear.beans.DistanceData;
import io.spotnext.whatsnear.beans.GeoLocationData;
import io.spotnext.whatsnear.beans.PointOfInterestData;
import io.spotnext.whatsnear.beans.PointOfInterestQueryData;
import io.spotnext.whatsnear.itemtypes.PointOfInterest;
import io.spotnext.whatsnear.itemtypes.enumeration.DistanceUnit;
import io.spotnext.whatsnear.itemtypes.enumeration.PointOfInterestType;
import io.spotnext.whatsnear.repositories.PointOfInterestRepository;
import io.spotnext.whatsnear.services.MessageService;
import io.spotnext.whatsnear.services.PointOfInterestService;

@Service
public class DefaultPointOfInterestService extends AbstractService implements PointOfInterestService {

	@Autowired
	private PointOfInterestRepository pointOfInterestRepository;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private UserService<User, UserGroup> userService;
	
	@Override
	public List<PointOfInterestData> findAll(PointOfInterestQueryData query) {
		
		var type = StringUtils.isNotBlank(query.getType()) ? PointOfInterestType.valueOf(query.getType()) : null;
		var text = StringUtils.isNotBlank(query.getTextSearch()) ? StringUtils.lowerCase(query.getTextSearch()) : null;
		var listings = pointOfInterestRepository.findAllByTypeAndText(type, text);
		
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
			ret = findAllNear(latitude, longitude, query);
		} else {
			ret = findAll(new PointOfInterestQueryData());
		}
		
		return ret;
	}

	@Override
	public List<PointOfInterestData> findAllNear(double latitude, double longitude, PointOfInterestQueryData query) {
		
		var searchPoint = getPoint(latitude, longitude);
		var maxDistance = Double.parseDouble(query.getMaxDistance());
		var pois = findAll(query);
		pois = checkDistance(pois, searchPoint, maxDistance);
		
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
	
	@Override
	public PointOfInterestData save(PointOfInterestData data) {
		var poi = modelService.create(PointOfInterest.class);
		
//		poi.setAuthor(data.getAuthor());
		poi.setDescription(data.getDescription());
		poi.setTitle(data.getTitle());
		poi.setType(data.getType());
		poi.setUid(getUid(data.getTitle()));
		poi.setLatitude(data.getLocation().getLatitude());
		poi.setLongitude(data.getLocation().getLongitude());
		
		var currentUser = userService.getCurrentUser();
		var user = userService.getUser(currentUser.getUid());
		poi.setAuthor(user);
		
		modelService.save(poi);
		
		return convert(poi);
	}
	
	private String getUid(String title) {
		var ret = StringUtils.lowerCase(title);
		ret = ret.replace(" ", "-");
		
		// TODO: check if uid exists
		
		return ret;
	}
	
	private List<PointOfInterestData> checkDistance(List<PointOfInterestData> pois, Point searchPoint, Double maxDistance) {
		var ret = new ArrayList<PointOfInterestData>();
		if (CollectionUtils.isNotEmpty(pois)) {
			for (var poi : pois) {
				var distance = getDistance(searchPoint, getPoint(poi));
				var distanceInKm = convertUnit(distance, DistanceUnit.Kilometers);
				if (maxDistance != null && maxDistance >= distanceInKm.getValue()) {
					poi.setDistance(distance);
					ret.add(poi);
				}
			}
		}
		return ret;
	}
	
	private DistanceData convertUnit(DistanceData data, DistanceUnit toUnit) {
		if (data.getUnit().equals(toUnit)) {
			return data;
		} else {
			if (DistanceUnit.Meters.equals(toUnit)) {
				data.setValue(data.getValue() * 1000);
			} else if (DistanceUnit.Kilometers.equals(toUnit)) {
				data.setValue(data.getValue() / 1000);
			}
			return data;
		}
	}
	
	@Override
	public PointOfInterestData convert(PointOfInterest source) {
		var data = new PointOfInterestData();
		
		data.setId(source.getId().toString());
		data.setUid(source.getUid());
		data.setTitle(source.getTitle());
		data.setDescription(source.getDescription());
		data.setType(source.getType());
		data.setAuthor(source.getAuthor().getUid());
		
		var location = new GeoLocationData();
		location.setLatitude(source.getLatitude());
		location.setLongitude(source.getLongitude());
		data.setLocation(location);
		
		if (source.getConversation() != null) {
			data.setConversation(messageService.convert(source.getConversation(), false));
		}
		
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

	@Override
	public PointOfInterest getPoi(String id) {
		var opt = pointOfInterestRepository.findById(Long.parseLong(id));
		
		return opt.isPresent() ? opt.get() : null;
	}

}
