

use strict;
use warnings;
use Threads;
use FileHandle;

use File::Path qw(make_path);;

my $outputPath = "./OUTPUT_SOLAR";

make_path($outputPath);

my @threads;
process_files("DATA");
foreach my $thread (@threads){
	$thread->join();
}

sub process_files {                                        
    my $path = shift;                                      
                                                           
    opendir (DIR, $path)                                   
        or die "Unable to open $path: $!";                 
                                                           
    my @files =                                            
        # Third: Prepend the full path                     
        map { $path . '/' . $_ }                           
        # Second: take out '.' and '..'                    
        grep { !/^\.{1,2}$/ }                              
        # First: get all files                             
        readdir (DIR);                                     
                                                           
    closedir (DIR);                                        

	make_path("$outputPath/$path");
    my $fh = FileHandle->new;
   	$fh->open(">$outputPath/$path/solar_prediction.csv") or die("Cannot open file: $outputPath/$path/solar_prediction.csv\n");
   	print $fh "longitude,latitude,unit\n";
                                                           
    for (@files) {                                         
# 			print STDERR "thread: $_\n";
       if (-d $_) {                                       
 			print STDERR "thread: $_\n";
#            process_files ($_);               
            push(@threads, threads->new(\&process_files,$_));
                                                           
        } else {                                           
			print STDERR " file: $path $_\n";
#            push(@threads, threads->new(\&process_file,$_));
           process_file($_,$fh);
        }                                                  
    }                                                      
    return @files;                                         
}                                                          


sub getLongitudelatitude{
	my $filename = shift;
	if($filename =~ /SUNY_(\d\d\d)(\d5)(\d\d)(\d5)\.csv$/){
		my $longitude = "$3.$4";
		my $latitude = "-$1.$2";
		return $longitude, $latitude;
	}else{
		print STDERR "getLoLa: Could not retrieve latitude longitude: $filename\n";
		return -1,-1;
	}
}


sub process_file{
	my $path = shift;
	my $fh = shift;
	if(! $path =~ /\.csv$/){
		return;
	}
	
	my ($longitude, $latitude) = &getLongitudelatitude($path);
	if($longitude eq -1 and $latitude eq -1){
		return;
	}
		
	open FILE,"<$path" or die("Cannot open file: $path\n");

	# Drop csv header
	<FILE>;

	
	my $dayCounter = 0;
	my $previousDay = 'empty';
	my $average = 0;
	my $previousYear = 'empty';
	while(<FILE>){
		if(/^(\d\d\d\d)-\d\d-(\d\d),\d\d:\d\d,(-?)(\d+),/){
#			print "iterate: $_\n";
			my $currentYear = $1;
			my $currentDay = $2;
			my $ugloSign = $3;
			my $uglo = $4;
			if($previousYear eq 'empty'){
				$previousYear = $currentYear;
			}elsif($currentYear ne $previousYear){
				print $fh "$longitude,$latitude,".int($average)."\n";
				return;
			}
			if($ugloSign eq '-'){
				print STDERR "$path: Skipping line: negative UGLO\n";
			}elsif($uglo eq '0'){
#				print STDERR "$path: Skipping line: number is zero\n";
			}else{
				$average += $uglo / 365;
			}
		}else{
			print STDERR "$path: Skipping line: Unexpected csv line format: $_";
		}
	}
	close FILE;
}

