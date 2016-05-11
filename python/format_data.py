
#IncidentNumber;DateOfCall;TimeOfCall;IncidentGroup;StopCodeDescription;SpecialServiceType;PropertyCategory;PropertyType;AddressQualifier;Postcode_full;Postcode_district;IncGeo_BoroughCode;IncGeo_BoroughName;IncGeo_WardCode;IncGeo_WardName;Easting_m;Northing_m;Easting_rounded;Northing_rounded;FRS;IncidentStationGround;FirstPumpArriving_AttendanceTime;FirstPumpArriving_DeployedFromStation;SecondPumpArriving_AttendanceTime;SecondPumpArriving_DeployedFromStation;NumStationsWithPumpsAttending;NumPumpsAttending
import csv

# init objects
year_data = {
    13 : 0,
    14 : 0,
    15 : 0,
    16 : 0
}

# becauase of wierd data syntax
month_converter = {
    'I' : 'jan',
    'II' : 'feb',
    'III' : 'mar',
    'IV' : 'apr',
    'V' : 'may',
    'VI' : 'jun',
    'VII' : 'jul',
    'VIII' : 'aug',
    'IX' : 'sep',
    'X' : 'okt',
    'XI' : 'nov',
    'XII' : 'dec',
}

month_data = {
    'jan' : 0,
    'feb' : 0,
    'mar' : 0,
    'apr' : 0,
    'may' : 0,
    'jun' : 0,
    'jul' : 0,
    'aug' : 0,
    'sep' : 0,
    'okt' : 0,
    'nov' : 0,
    'dec' : 0
}

day_data = {}
#loop to init object
for i in xrange(1,32):
    day_data[i] = 0

timeslot_data = {}
#loop to init object
for i in xrange(0,24):
    timeslot_data[i] = 0


def parseAndStoreDateString(row):
    row_split = row.split(".")
    day_of_month = row_split[0]
    month_of_year = row_split[1]
    year = row_split[2]
    day_data[int(day_of_month)] = day_data[int(day_of_month)] + 1
    month_data[month_converter[month_of_year]] = month_data[month_converter[month_of_year]] + 1
    year_data[int(year)] = year_data[int(year)] + 1

def parseAndStoreTimeString(row):
    row_split = row.split(":")
    hour = int(row_split[0])
    timeslot_data[hour] = timeslot_data[hour] + 1



with open('data/lfb_jan2013-mar2016.csv', 'rb') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='|', skipinitialspace=True)
    for row in spamreader:
        parseAndStoreDateString(row[1])
        parseAndStoreTimeString(row[2])



print year_data
print month_data
print day_data
print timeslot_data