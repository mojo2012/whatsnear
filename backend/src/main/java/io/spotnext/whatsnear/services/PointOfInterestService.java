package io.spotnext.whatsnear.services;

import java.util.List;

import io.spotnext.whatsnear.beans.PointOfInterestData;
import io.spotnext.whatsnear.beans.PointOfInterestQueryData;

public interface PointOfInterestService {
	
	List<PointOfInterestData> findAll();
	
	List<PointOfInterestData> findAllNear(double latitude, double longitude);

	List<PointOfInterestData> findAllNear(PointOfInterestQueryData query);
	
	PointOfInterestData save(PointOfInterestData data);
	
}
