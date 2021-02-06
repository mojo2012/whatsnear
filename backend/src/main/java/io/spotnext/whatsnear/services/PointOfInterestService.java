package io.spotnext.whatsnear.services;

import java.util.List;

import io.spotnext.whatsnear.beans.PointOfInterestData;
import io.spotnext.whatsnear.beans.PointOfInterestQueryData;
import io.spotnext.whatsnear.itemtypes.PointOfInterest;

public interface PointOfInterestService {
	
	List<PointOfInterestData> findAll(PointOfInterestQueryData query);
	
	List<PointOfInterestData> findAllNear(double latitude, double longitude, PointOfInterestQueryData query);

	List<PointOfInterestData> findAllNear(PointOfInterestQueryData query);
	
	PointOfInterestData save(PointOfInterestData data);

	PointOfInterest getPoi(String id);
	
	PointOfInterestData convert(PointOfInterest poi);
	
}
