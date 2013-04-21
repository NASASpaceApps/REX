

use strict;
use warnings;
use Threads;
use FileHandle;
use File::Copy;

use File::Path qw(make_path);;

my $outputPath = "./OUTPUT_SOLAR";

#make_path($outputPath);

my @threads;
process_files("OUTPUT");
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
                                                          
    for (@files) {                                         
# 			print STDERR "thread: $_\n";
       if (-d $_) {                                       
 			print STDERR "thread: $_\n";
            process_files ($_);               
#            push(@threads, threads->new(\&process_files,$_));
                                                           
        } else {                                           
			print STDERR " file: $path $_\n";
#            push(@threads, threads->new(\&process_file,$_));
           process_file($_);
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
	
	my ($longitude, $latitude) = &getLongitudelatitude($path);
	
	if($longitude == -1 and $latitude == -1){
		print STDERR "skipping file: not a solar preditcion csv file: $path";
	}
	if( $path =~ /^(.*)(SUNY_\d+\.csv)$/){
		my $pathPrepend = $1;
		my $filename = $2;
		my $solarfilename = $pathPrepend."solar_prediction.csv";
#		move("$pathPrepend$filename", $solarfilename);
		open IN, "<$pathPrepend$filename";
		open OUT, ">$solarfilename";
		
		my $lalo = ",$longitude,$latitude";
		while (<IN>){
			chomp;
			print OUT $_ . $lalo . "\n";
		}
		close IN;
		close OUT;

		print STDERR `c:\\xampp\\mysql\\bin\\mysqlimport --local --fields-optionally-enclosed-by="" --fields-terminated-by="," --lines-terminated-by="\\r\\n" --user=root --password=xampp rex --ignore-lines=1 --columns=year,week,unit,longitude,latitude $solarfilename`;
		
		unlink("$solarfilename");

#		move($solarfilename, "$pathPrepend$filename");
#		move($path,$1."solar.csv")
	}else{
		print STDERR "skipping file: not a solar prediction csv file: $path";
		return;
	}
	
	
}

