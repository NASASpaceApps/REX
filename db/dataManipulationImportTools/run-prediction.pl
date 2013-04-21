

use strict;
use warnings;
use Threads;

use File::Path qw(make_path);;

my $outputPath = "./OUTPUT";

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
                                                           
    for (@files) {                                         
# 			print STDERR "thread: $_\n";
       if (-d $_) {                                       
			make_path("$outputPath/$_");
#            process_files ($_);               
            push(@threads, threads->new(\&process_files,$_));
                                                           
        } else {                                           
#            push(@threads, threads->new(\&process_file,$_));
			print STDERR "thread: $path $_\n";
            process_file($_);
        }                                                  
    }                                                      
    return @files;                                         
}                                                          



sub process_file{
	my $path = shift;
	open FILE,"<$path" or die("Cannot open file: $outputPath/$path\n");

	if(! $path =~ /\.csv$/){
		return;
	}
		
	# Drop csv header
	<FILE>;
	
	open OUTFILE, ">$outputPath/$path" or die("Cannot open file: $outputPath/$path\n");
	print OUTFILE "Year,Week,uglo(average_of_day)\n";
	
	my $dayCounter = 0;
	my $previousDay = 'empty';
	my $previousYear = 'empty';
	my $sum = 0;
	my $weeknum = 1;
	while(<FILE>){
		if(/^(\d\d\d\d)-\d\d-(\d\d),\d\d:\d\d,(-?)(\d+),/){
			my $currentYear = $1;
			my $currentDay = $2;
			my $ugloSign = $3;
			my $uglo = $4;
			if($ugloSign eq '-'){
#				print STDERR "$path: Skipping line: negative UGLO\n";
			}elsif($uglo eq '0'){
#				print STDERR "$path: Skipping line: number is zero\n";
			}else{
				if($previousDay ne $currentDay or $previousYear ne $currentYear){
#						print STDERR "         WeekNum:$weeknum PrevY:$previousYear CurY:$currentYear PrevD:$previousDay CurD:$currentDay";
					if(($dayCounter == 7) and $previousDay ne 'empty'){
#						print STDERR " FLIPOVER $dayCounter";
						#write output
						my $ugloOut = int($sum / 7);
						print OUTFILE "$previousYear,$weeknum,$ugloOut\n";
						
						$dayCounter = 0;
						$sum = 0;
						$weeknum++;
						$previousDay = 'empty';
					}
#					print STDERR "\n";
					$dayCounter++;
				}
				if($previousYear ne $currentYear){
					$dayCounter = 0;
					$sum = 0;
					$previousDay = 'empty';
					$weeknum = 1;
				}
				$sum += $uglo;
				$previousDay = $currentDay;
				$previousYear = $currentYear;
			}
		}else{
			print STDERR "$path: Skipping line: Unexpected csv line format: $_";
		}
	}
	if(($dayCounter == 7) and $previousDay ne 'empty'){
		my $ugloOut = $sum / 7;
		print OUTFILE "$previousYear,$weeknum,$ugloOut\n";
	}
	close FILE;
	close OUTFILE;
}
