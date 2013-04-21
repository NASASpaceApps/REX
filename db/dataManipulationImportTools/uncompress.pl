

use strict;
use warnings;
use Threads;

use File::Path qw(make_path);;

my $outputPath = "c:/DATA/rex/OUTPUT";

#make_path($outputPath);

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
       if (-d $_) {                                       
	#		make_path("$outputPath/$_");
 			print STDERR "thread: $_\n";
#            process_files ($_);               
            push(@threads, threads->new(\&process_files,$_));
                                                           
        } else {                                           
#            push(@threads, threads->new(\&process_file,$_));
            process_file($_);
        }                                                  
    }                                                      
    return @files;                                         
}                                                          



sub process_file{
	my $path = shift;
	if($path =~ /^((.+\/)SUNY_\d+\.csv)\.gz$/ ){
 			print STDERR "file: $path\n";
 		unlink $1;
		`7z x ./$path -o$2`;
		#print `del /F $path`;
		unlink $path;
	}
}
